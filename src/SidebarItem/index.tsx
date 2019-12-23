import React from "react";
import Note from "../types/NoteTypes";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DeleteIcon from "@material-ui/icons/Delete";
import { removeHTMLTags } from "../helpers";
import { makeStyles } from "@material-ui/core/styles";
import styles from "./styles";

interface Props {
  _index: number;
  _note: Note;
  selectedNoteIndex: number | null;
  deleteNote: (note: Note) => void;
  selectNote: (note: Note, index: number) => void;
}

function SidebarItem(props: Props): JSX.Element {
  const { _index, _note, selectedNoteIndex } = props;
  const selectNote = (n: Note, i: number) => {
    props.selectNote(n, i);
  };
  const deleteNote = (note: Note) => {
    if (window.confirm(`Are you sure you want to delete: ${note.title}`)) {
      props.deleteNote(note);
    }
  };

  // @ts-ignore
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  return (
    <div key={_index}>
      <ListItem
        className={classes.listItem}
        selected={selectedNoteIndex === _index}
        alignItems="flex-start"
      >
        <div
          className={classes.textSectionContainer}
          onClick={() => selectNote(_note, _index)}
        >
          <div className={classes.textSection}>
            <ListItemText
              primary={_note.title}
              secondary={removeHTMLTags(_note.body.substring(0, 30)) + "…"}
            ></ListItemText>
          </div>
        </div>
        <DeleteIcon
          onClick={() => deleteNote(_note)}
          className={classes.deleteIcon}
        ></DeleteIcon>
      </ListItem>
    </div>
  );
}

export default SidebarItem;
