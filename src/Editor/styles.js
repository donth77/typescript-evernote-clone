const styles = {
  root: {
    backgroundColor: "#fff",
    height: "calc(100% - 35px)",
    position: "absolute",
    left: "0",
    width: "300px",
    boxShadow: "0px 0px 2px black"
  },
  editorHeader: {
    height: "50px",
    boxSizing: "border-box",
    border: "none",
    padding: "5px",
    width: "100%",
    backgroundColor: "#29487d",
    paddingLeft: "50px",
    display: "inline-flex",
    justifyContent: "space-between"
  },
  titleInput: {
    boxSizing: "border-box",
    border: "none",
    fontSize: "24px",
    backgroundColor: "#29487d",
    color: "white",
    height: "100%",
    width: "85%",
    outline: "none"
  },
  editorSelect: {
    color: "white"
  },
  editIcon: {
    position: "absolute",
    left: "310px",
    top: "12px",
    color: "white",
    width: "10",
    height: "10"
  },
  editorContainer: {
    height: "100%",
    boxSizing: "border-box",
    flex: "2"
  }
};

export default styles;
