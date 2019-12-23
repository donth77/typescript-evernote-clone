import React, { useState } from "react";
import List from "@material-ui/core/List";
import { Divider, Button, makeStyles } from "@material-ui/core";
import SidebarItemComponent from "../SidebarItem";
import Note from "../types/NoteTypes";
import styles from "./styles";

interface Props {
  deleteNote: (note: Note) => void;
  newNote: (title: string) => void;
  notes: Note[];
  selectedNoteIndex: number | null;
  selectNote: (note: Note, index: number) => void;
}

function Sidebar(props: Props): JSX.Element {
  const [addingNote, setAddingNote] = useState<boolean>(false);
  const [title, setTitle] = useState<string | null>(null);

  const { notes, selectedNoteIndex } = props;

  const newNoteBtnClick = () => {
    setTitle(null);
    setAddingNote(!addingNote);
  };
  const updateTitle = (newTitle: string) => {
    setTitle(newTitle);
  };
  const newNote = () => {
    if (title) {
      props.newNote(title);
      setTitle(null);
      setAddingNote(false);
    }
  };
  const selectNote = (n: Note, i: number) => props.selectNote(n, i);
  const deleteNote = (note: Note) => props.deleteNote(note);

  // @ts-ignore
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  return (
    <div className={classes.sidebarContainer}>
      <Button onClick={newNoteBtnClick} className={classes.newNoteBtn}>
        {addingNote ? "Cancel" : "New Note"}
      </Button>
      {addingNote ? (
        <div>
          <input
            type="text"
            className={classes.newNoteInput}
            placeholder="Enter note title"
            onKeyUp={(e: any) => updateTitle(e.target.value)}
          ></input>
          <Button className={classes.newNoteSubmitBtn} onClick={newNote}>
            Submit Note
          </Button>
        </div>
      ) : null}
      <List>
        {notes.map((_note, _index) => {
          return (
            <div key={_index}>
              <SidebarItemComponent
                _note={_note}
                _index={_index}
                selectedNoteIndex={selectedNoteIndex}
                selectNote={selectNote}
                deleteNote={deleteNote}
              ></SidebarItemComponent>
              <Divider></Divider>
            </div>
          );
        })}
      </List>
    </div>
  );
}

export default Sidebar;
