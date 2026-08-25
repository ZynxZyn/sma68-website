import { NextResponse } from 'next/server';

export function json(data: unknown, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export function ok(data: unknown): NextResponse {
  return json({ success: true, data });
}

export function created(data: unknown): NextResponse {
  return json({ success: true, data }, 201);
}

export function error(message: string, status = 400, details?: unknown): NextResponse {
  return json(
    { success: false, error: message, ...(details !== undefined ? { details } : {}) },
    status,
  );
}

export function unauthorized(message = 'Unauthorized'): NextResponse {
  return error(message, 401);
}

export function forbidden(message = 'Forbidden'): NextResponse {
  return error(message, 403);
}

export function notFound(message = 'Not found'): NextResponse {
  return error(message, 404);
}

export function parsePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit')) || 10));
  return { page, limit, skip: (page - 1) * limit };
}
