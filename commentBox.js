/**
 * Create a template element.
 * Define the structure of the web component as its innerHTML.
 */
const template = document.createElement("template");
/**
 * Styles for the web component is available in 'commentBoxStyle.css'.
 * The style file is linked within the innerHTML.
 *
 * The comment box consists of two parts.
 * 1. comment-edit-box:
 *    - Consists of the 'comment input field' and 'submit button'.
 * 2. comment-display-box:
 *    - Div that Displays the submitted comment, its author details, number of likes for that comment(initially 0)
 *    - like and reply buttons.
 *    - reply-box div:
 *        - the nested comment boxes for replies gets attached here when the reply button is clicked.
 */
template.innerHTML = `
    <link rel="stylesheet" href="commentBoxStyle.css" />
    <div class="comment-box">
        <div class="comment-edit">
            <input class="comment-input" type="text" />
            <button class="submit-btn">Submit</button>
        </div>
        <div class="comment-display">
            <p class="comment">Comment</p>
            <p class="author">Author:</p>
            <p class="likes">Likes: 0</p>
            <button class="like-btn">Like</button>
            <button class="reply-btn">Reply</button>
            <div class="reply-box"></div>
        </div>
    </div>
`;
/**
 * The value of 'nestingLimit' is used to limit the number of nested replies any user can add.
 * Here, nesting is limited to three levels.
 * This may be changed according to requirement.
 */
const nestingLimit = 3;

/**
 *  Class which extends 'HTMLElement' and defines the Web Component.
 *  This class is exported as an ES Module.
 */
export class CommentBox extends HTMLElement {
    constructor() {
        // Calling the constructor of the base class (HTMLElement)
        super();

        // Setting the value of 'level' from the 'level' attribute in html.
        this.level = this.getAttribute("level")
            ? // If value is available, assign it to 'level'.
              parseInt(this.getAttribute("level"))
            : // Else 'level' is set as 0 by default.
              0;

        // Initializing likeCount to 0 for the comment box.
        this.likeCount = 0;

        // Attach a shadow DOM tree to 'this', which is the Web Component itself.
        // 'open' mode specifies that, elements of the shadow root
        // are accessible from JavaScript outside the root
        this.attachShadow({ mode: "open" });

        // Appending a clone of the template defined above to the shadowRoot.
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // Setting the 'commentEdit' and 'commentDisplay' variables to point to its respective HTML elements in the shadow DOM
        this.commentEdit = this.shadowRoot.querySelector(".comment-edit");
        this.commentDisplay = this.shadowRoot.querySelector(".comment-display");
    }
    /**
     * This method executes as soon as the Web Component is attached to the DOM.
     * We attach the event listeners for all the buttons present on the component in this method.
     */
    connectedCallback() {
        this.commentEdit
            .querySelector(".submit-btn")
            .addEventListener("click", () => this.commentSubmit());

        this.commentDisplay
            .querySelector(".like-btn")
            .addEventListener("click", () => this.commentLike());

        if (this.level < nestingLimit) {
            this.commentDisplay
                .querySelector(".reply-btn")
                .addEventListener("click", () => this.commentReply());
        } else {
            this.commentDisplay.querySelector(".reply-btn").disabled = true;
        }

        this.commentDisplay.style.display = "none";
    }

    commentSubmit() {
        const commentInput = this.commentEdit.querySelector(".comment-input");

        const comment = this.commentDisplay.querySelector(".comment");
        const author = this.commentDisplay.querySelector(".author");

        comment.innerHTML = commentInput.value;
        author.innerHTML = `Author: ${sessionStorage.getItem("currentUser")}`;

        this.commentEdit.style.display = "none";
        this.commentDisplay.style.display = "block";
    }

    commentLike() {
        const likes = this.commentDisplay.querySelector(".likes");

        this.likeCount++;
        likes.innerHTML = `Likes: ${this.likeCount}`;
    }

    commentReply() {
        const replyBox = this.commentDisplay.querySelector(".reply-box");
        const newCommentBox = document.createElement("comment-box");

        let newLevel = this.level + 1;
        newCommentBox.setAttribute("level", newLevel);
        newCommentBox.level = newLevel;
        if (replyBox.childNodes) {
            replyBox.insertBefore(newCommentBox, replyBox.childNodes[0]);
        } else {
            replyBox.appendChild(newCommentBox);
        }
    }

    /**
     * The disconnectedCallback() is executed when the component is disconnected from the DOM.
     * Here we remove all the event listeners that were attached while the component was created.
     */
    disconnectedCallback() {
        this.commentEdit.querySelector(".comment-submit").removeEventListener();
        this.commentDisplay.querySelector(".reply-btn").removeEventListener();
        this.commentDisplay.querySelector(".like-btn").removeEventListener();
    }
}
