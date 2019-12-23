import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import { Select, MenuItem } from "@material-ui/core";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import { makeStyles } from "@material-ui/core/styles";

import ReactMde from "react-mde";
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";

import Note, { NoteBlob, ContentType, MarkdownTab } from "../types/NoteTypes";
import debounce from "../helpers";
import styles from "./styles";

interface Props {
  noteUpdate: (id: string, noteObj: NoteBlob) => void;
  selectedNote: Note;
}

function Editor(props: Props): JSX.Element {
  const [didMount, setDidMount] = useState<boolean>(false);
  const [body, setBody] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [id, setID] = useState<string>("");
  const [selectedType, setSelectedType] = useState<ContentType>(
    props.selectedNote.contentType
  );
  const [selectedTab, setSelectedTab] = React.useState<MarkdownTab>(
    MarkdownTab.WRITE
  );
  const [didSelectNote, setDidSelectNote] = useState<boolean>(false);

  const { selectedNote } = props;

  useEffect(() => {
    setDidMount(true);
  }, []);

  useEffect(() => {
    setDidSelectNote(true);
    setBody(selectedNote.body);
    setTitle(selectedNote.title);
    setSelectedType(selectedNote.contentType);
    setSelectedTab(selectedNote.selectedMDTab);
    setID(selectedNote.id);
  }, [selectedNote]);

  useEffect(() => {
    setDidSelectNote(false);
  }, [didSelectNote]);

  useEffect(() => {
    update(title, body);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);

  useEffect(() => {
    if (didMount) {
      if (selectedType === ContentType.MARKDOWN) {
        updateBody(mdConverter.makeMarkdown(body));
      } else {
        updateBody(mdConverter.makeHtml(body));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType]);

  const update = debounce((noteTitle: string, noteBody: string) => {
    if (id === selectedNote.id) {
      props.noteUpdate(id, {
        title: noteTitle,
        body: noteBody,
        contentType: selectedType,
        selectedMDTab: selectedTab
      });
    }
  }, 1500);

  const updateBody = async (newBody: string) => {
    if (!didSelectNote) {
      setBody(newBody);
      update(title, newBody);
    }
  };
  const updateTitle = async (newTitle: string) => {
    setTitle(newTitle);
    update(newTitle, body);
  };
  const updateType = async (event: any) => {
    const type = event.target.value;
    setSelectedType(type);
  };
  const updateTab = async (tab: any) => {
    setSelectedTab(tab);
  };

  const mdConverter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true
  });

  const quillModules = {
    toolbar: [
      [{ font: [] }, { header: [1, 2, 3, 4, 5, false] }],
      ["bold", "italic", "strike"],
      ["link", "blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }, { align: [] }]
    ],
    clipboard: {
      matchVisual: false
    }
  };

  // @ts-ignore
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  return (
    <div className={classes.editorContainer}>
      <BorderColorIcon className={classes.editIcon}></BorderColorIcon>
      <div className={classes.editorHeader}>
        <input
          className={classes.titleInput}
          placeholder="Note title…"
          value={title || ""}
          onChange={e => updateTitle(e.target.value)}
        ></input>
        <Select
          labelId="editorLabel"
          id="editorSelect"
          defaultValue={ContentType.RICH}
          value={selectedType}
          className={classes.editorSelect}
          onChange={updateType}
        >
          <MenuItem value={ContentType.RICH}>Rich Text</MenuItem>
          <MenuItem value={ContentType.MARKDOWN}>Markdown</MenuItem>
        </Select>
      </div>
      {selectedType === ContentType.RICH ? (
        <ReactQuill
          className={classes.quill}
          value={body}
          onChange={updateBody}
          modules={quillModules}
        ></ReactQuill>
      ) : (
        <ReactMde
          value={body}
          onChange={updateBody}
          selectedTab={selectedTab}
          onTabChange={updateTab}
          generateMarkdownPreview={markdown =>
            Promise.resolve(mdConverter.makeHtml(markdown))
          }
        />
      )}
    </div>
  );
}

export default Editor;
