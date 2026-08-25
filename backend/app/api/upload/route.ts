import { NextRequest } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2, R2_BUCKET, R2_PUBLIC_URL } from '@/lib/r2';
import { ok, error } from '@/lib/api';
import { requireAuth } from '@/lib/auth-guard';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export const config = {
  api: { bodyParser: false },
};

export async function POST(req: NextRequest) {
  // Auth check — hanya admin ke atas yang boleh upload
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'ADMIN', 'STAFF', 'GURU']);
  if ('res' in auth) return auth.res;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return error('Gagal membaca file upload', 400);
  }

  const file = formData.get('file') as File | null;
  if (!file) return error('Tidak ada file yang dikirim', 400);

  // Validasi tipe file
  if (!ALLOWED_TYPES.includes(file.type)) {
    return error(`Tipe file tidak diizinkan. Gunakan: ${ALLOWED_TYPES.join(', ')}`, 400);
  }

  // Validasi ukuran file
  if (file.size > MAX_SIZE_BYTES) {
    return error(`Ukuran file maksimal ${MAX_SIZE_MB}MB`, 400);
  }

  // Buat nama file unik
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const folder = formData.get('folder') as string ?? 'uploads';
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  const key = `${folder}/${timestamp}-${random}.${ext}`;

  // Upload ke R2
  const buffer = Buffer.from(await file.arrayBuffer());
  try {
    await r2.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        CacheControl: 'public, max-age=31536000',
      })
    );
  } catch (e) {
    console.error('[R2 Upload Error]', e);
    return error('Gagal mengupload file ke penyimpanan', 500);
  }

  const url = `${R2_PUBLIC_URL}/${key}`;
  return ok({ url, key, size: file.size, type: file.type });
}
