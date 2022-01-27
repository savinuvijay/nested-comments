// CommentBox is an ES module
import { CommentBox } from "./commentBox.js";

// Set the current user data into the session storage.
sessionStorage.setItem("currentUser", "John");

// Define the CommentBox class as a custom element aka Web Component
// Custom HTML tag for this element is set as 'comment-box'
window.customElements.define("comment-box", CommentBox);
