import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Editor from "./Editor";
import Note, {
  NoteBlob,
  FSNoteUpdate,
  FSNoteCreate,
  Guid,
  ContentType,
  MarkdownTab
} from "./types/NoteTypes";
import "./App.css";

const firebase = require("firebase");

const NOTES_COLLECTION_NAME = "notes";

function App(): JSX.Element {
  const [selectedNoteIndex, setSelectedNoteIndex] = useState<number | null>(
    null
  );
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    firebase
      .firestore()
      .collection(NOTES_COLLECTION_NAME)
      .onSnapshot((serverUpdate: any) => {
        const notes = serverUpdate.docs.map((_doc: any) => {
          const data = _doc.data();
          data["id"] = _doc.id;
          return data;
        });
        setNotes(notes);
      });
  }, []);

  const selectNote = (note: Note, index: number) => {
    setSelectedNoteIndex(index);
    setSelectedNote(note);
  };

  const noteUpdate = (id: Guid, noteObj: NoteBlob) => {
    const fsNote: FSNoteUpdate = {
      title: noteObj.title,
      body: noteObj.body,
      contentType: noteObj.contentType,
      selectedMDTab: noteObj.selectedMDTab,
      updated: firebase.firestore.FieldValue.serverTimestamp()
    };
    firebase
      .firestore()
      .collection(NOTES_COLLECTION_NAME)
      .doc(id)
      .update(fsNote);
  };

  const newNote = async (title: string) => {
    const [body, timestamp] = [
      "",
      firebase.firestore.FieldValue.serverTimestamp()
    ];
    const fsNote: FSNoteCreate = {
      title,
      body,
      created: timestamp,
      updated: null,
      contentType: ContentType.RICH,
      selectedMDTab: MarkdownTab.WRITE
    };
    const newFromDB = await firebase
      .firestore()
      .collection(NOTES_COLLECTION_NAME)
      .add(fsNote);
    const newID = newFromDB.id;
    const note: Note = {
      title,
      body,
      created: timestamp,
      updated: null,
      id: newID,
      contentType: ContentType.RICH,
      selectedMDTab: MarkdownTab.WRITE
    };
    setNotes([...notes, note]);
    const newNoteIndex = notes.indexOf(
      notes.filter((_note: Note) => _note.id === newID)[0]
    );
    setSelectedNote(notes[newNoteIndex]);
    setSelectedNoteIndex(newNoteIndex);
  };

  const deleteNote = async (note: Note) => {
    const noteIndex = notes.indexOf(note);
    setNotes(notes.filter(_note => _note !== note));
    if (selectedNoteIndex === noteIndex) {
      setSelectedNoteIndex(null);
      setSelectedNote(null);
    } else {
      if (notes.length > 1 && selectedNoteIndex) {
        selectNote(notes[selectedNoteIndex - 1], selectedNoteIndex - 1);
      } else {
        setSelectedNoteIndex(null);
        setSelectedNote(null);
      }
    }

    firebase
      .firestore()
      .collection(NOTES_COLLECTION_NAME)
      .doc(note.id)
      .delete();
  };

  return (
    <div className="app-container">
      <Sidebar
        selectedNoteIndex={selectedNoteIndex}
        notes={notes}
        deleteNote={deleteNote}
        selectNote={selectNote}
        newNote={newNote}
      ></Sidebar>
      {selectedNote ? (
        <Editor selectedNote={selectedNote} noteUpdate={noteUpdate}></Editor>
      ) : null}
    </div>
  );
}

export default App;
