import { CommentBox } from "./commentBox.js";

sessionStorage.setItem("currentUser", "John");

window.customElements.define("comment-box", CommentBox);
