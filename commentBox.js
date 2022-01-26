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

        // Make 'commentEdit' and 'commentDisplay' variables to point to its respective HTML elements in the shadow DOM
        this.commentEdit = this.shadowRoot.querySelector(".comment-edit");
        this.commentDisplay = this.shadowRoot.querySelector(".comment-display");
    }
    /**
     * This method executes as soon as the Web Component is attached to the DOM.
     * We attach the event listeners for all the buttons present on the component in this method.
     */
    connectedCallback() {
        // Attaching commentSubmit() listner to click event for the Submit button.
        this.commentEdit
            .querySelector(".submit-btn")
            .addEventListener("click", () => this.commentSubmit());

        // Attaching commentLike() listner to click event for the Like button.
        this.commentDisplay
            .querySelector(".like-btn")
            .addEventListener("click", () => this.commentLike());

        // Attaching commentLike() listner to click event for the Reply button -
        // if the current level is less than nesting limit.
        if (this.level < nestingLimit) {
            this.commentDisplay
                .querySelector(".reply-btn")
                .addEventListener("click", () => this.commentReply());
        } else {
            // Disabling the Reply Button if current level is not less than nesting limit.
            this.commentDisplay.querySelector(".reply-btn").disabled = true;
        }

        // Setting the display style for the commentDisplay element to none.
        // This element will be initially hidden from view and will be displayed only when the comment is submitted.
        this.commentDisplay.style.display = "none";
    }

    /**
     * This method is called when the user clicks the submit button.
     */
    commentSubmit() {
        // make the commentInput variable to point to the input box HTML element.
        const commentInput = this.commentEdit.querySelector(".comment-input");

        // make the comment variable to point to the div in which the comment will be displayed
        const comment = this.commentDisplay.querySelector(".comment");

        // make the author variable to point to the author <p> tag.
        const author = this.commentDisplay.querySelector(".author");

        // Set the comment submitted by the user as the content for display.
        comment.innerHTML = commentInput.value;
        // Set the author name with the value of Current User from sessionStorage
        author.innerHTML = `Author: ${sessionStorage.getItem("currentUser")}`;

        // Hide commentEdit div
        this.commentEdit.style.display = "none";
        // Unhide commentDisplay div
        this.commentDisplay.style.display = "block";
    }

    /**
     * This method is called when the user clicks on the Like button present beside any comment.
     */
    commentLike() {
        // make the likes variable to point to the likes <p> tag.
        const likes = this.commentDisplay.querySelector(".likes");

        // Increment like count
        this.likeCount++;

        // Set the update like count for display.
        likes.innerHTML = `Likes: ${this.likeCount}`;
    }

    /**
     * This method is called when the user clicks on the Reply button present beside any comment.
     */
    commentReply() {
        // Make the replyBox variable to point to the reply-box DIV.
        const replyBox = this.commentDisplay.querySelector(".reply-box");
        // create a new comment-box component as an HTML element and set its value to the newCommentBox variable.
        const newCommentBox = document.createElement("comment-box");

        // Set newLevel by incrementing current level by 1.
        let newLevel = this.level + 1;
        // Set the value of level attribute as newLevel for the newCommentBox component.
        newCommentBox.setAttribute("level", newLevel);
        newCommentBox.level = newLevel;

        // If the reply box already has any child nodes,
        if (replyBox.childNodes) {
            // the newCommentBox is inserted before the first child in the reply box.
            replyBox.insertBefore(newCommentBox, replyBox.childNodes[0]);
        } else {
            // newCommentBox is appended directly as the first child.
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
