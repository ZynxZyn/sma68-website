import { NextRequest } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getR2Client, getR2Bucket, getR2PublicUrl } from '@/lib/r2';
import { ok, error } from '@/lib/api';
import { requireAuth } from '@/lib/auth-guard';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export async function POST(req: NextRequest) {
  // Auth check — hanya pengguna terautentikasi (admin/guru/staff) yang boleh upload
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'ADMIN', 'STAFF', 'GURU']);
  if ('res' in auth) {
    return auth.res;
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch (err: any) {
    return error(`Gagal membaca file upload: ${err?.message || err}`, 400);
  }

  const file = formData.get('file') as File | null;
  if (!file) {
    return error('Tidak ada file yang dikirim', 400);
  }

  // Validasi tipe file
  if (!ALLOWED_TYPES.includes(file.type)) {
    return error(`Tipe file tidak diizinkan (${file.type}). Gunakan: ${ALLOWED_TYPES.join(', ')}`, 400);
  }

  // Validasi ukuran file
  if (file.size > MAX_SIZE_BYTES) {
    return error(`Ukuran file maksimal ${MAX_SIZE_MB}MB`, 400);
  }

  // Buat nama file unik
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const folder = (formData.get('folder') as string) || 'uploads';
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  const key = `${folder}/${timestamp}-${random}.${ext}`;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const r2 = getR2Client();
    const bucket = getR2Bucket();

    await r2.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        CacheControl: 'public, max-age=31536000',
      })
    );

    const publicUrl = getR2PublicUrl();
    const url = `${publicUrl}/${key}`;

    return ok({ url, key, size: file.size, type: file.type });
  } catch (e: any) {
    console.error('[R2 Upload Error]', e);
    return error(`Gagal upload ke R2: ${e?.message || 'Unknown storage error'}`, 500);
  }
}

