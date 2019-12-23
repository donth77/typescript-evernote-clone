import { firestore } from "firebase-admin";

export type Guid = string;

export enum ContentType {
  RICH = "rich",
  MARKDOWN = "markdown"
}

export enum MarkdownTab {
  WRITE = "write",
  PREVIEW = "preview"
}

export default interface Note {
  body: string;
  created: firestore.Timestamp;
  updated: firestore.Timestamp | null;
  title: string;
  id: Guid;
  contentType: ContentType;
  selectedMDTab: MarkdownTab;
}

export type FSNoteCreate = Omit<Note, "id">;

export type FSNoteUpdate = Omit<Note, "id" | "created">;

export type NoteBlob = Omit<Note, "created" | "updated" | "id">;
