// src/api/links.ts
import { api } from "../lib/axios";

export interface Link {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: string;
  accessCount: number;
}

export interface CreateLinkInput {
  originalUrl: string;
  shortCode?: string;
}

export async function getLinks() {
  const response = await api.get<Link[]>("/links");
  return response.data;
}

export async function createLink(data: CreateLinkInput) {
  const response = await api.post<Link>("/links", data);
  return response.data;
}

export async function deleteLink(linkId: string) {
  await api.delete(`/links/${linkId}`);
}

export async function resolveLink(shortCode: string) {
  const response = await api.get<{ originalUrl: string }>(`/${shortCode}`);
  return response.data;
}

export async function exportLinks() {
  const response = await api.post<{ publicUrl: string }>("/links/export");
  return response.data;
}
