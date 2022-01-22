const template = document.createElement("template");
template.innerHTML = `
  <style>

    .comment-box {
        margin-top: 20px;
        border-radius: 5px;
        padding: 20px;
        color: #333;
        box-shadow: rgba(3, 8, 20, 0.3) 0px 0.15rem 0.5rem,
            rgba(2, 8, 20, 0.2) 0px 0.075rem 0.175rem;
        background-color: #f3f3f3;
    }

    .comment-box .author {
        margin-top: 10px;
    }

    .comment-box .likes {
        margin-bottom: 10px;
    }

    .comment-box .reply-box {
        margin-top: 10px;
    }

    .comment-box button {
        margin-top: 5px;
        margin-right: 5px;
        padding: 5px 10px;
        border-radius: 3px;
        font-weight: 500;
        border-style: none;
        border-width: 2px;
        border-color: #333;
        background: #fff;
        box-shadow: rgba(3, 8, 20, 0.3) 0px 0.15rem 0.5rem,
            rgba(2, 8, 20, 0.3) 0px 0.075rem 0.175rem;
        display: inline;
    }

  </style>
  <div class="comment-box">
    <div class="comment-edit">
      <input class="comment-input" type="text" />
      <button class="comment-submit">Submit</button>
    </div>
    <div class="comment-display">
      <p class="comment">Comment</p>
      <p class="author">Author:</p>
      <p class="likes">Likes:</p>
      <button class="like-btn">Like</button>
      <button class="reply-btn">Reply</button>
      <div class="reply-box"></div>
    </div>
  </div>
`;

export class CommentBox extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.level = this.getAttribute("level");
        this.likeCount = 0;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    commentSubmit() {
        const commentBox = this.shadowRoot.querySelector(".comment-edit");
        const commentDisplay =
            this.shadowRoot.querySelector(".comment-display");
        const commentInput = this.shadowRoot.querySelector(".comment-input");
        const comment = commentDisplay.querySelector(".comment");
        const likes = commentDisplay.querySelector(".likes");
        comment.innerHTML = commentInput.value;
        likes.innerHTML = `Likes: ${this.likeCount}`;
        commentBox.style.display = "none";
        commentDisplay.style.display = "block";
    }

    commentLike() {
        const commentDisplay =
            this.shadowRoot.querySelector(".comment-display");
        const likes = commentDisplay.querySelector(".likes");
        this.likeCount++;
        likes.innerHTML = `Likes: ${this.likeCount}`;
    }
    commentReply() {
        if (parseInt(this.level) < 3) {
            const replyBox = this.shadowRoot.querySelector(".reply-box");
            const newCommentBox = document.createElement("comment-box");
            newCommentBox.setAttribute("level", parseInt(this.level) + 1);
            newCommentBox.level = parseInt(this.level) + 1;
            if (replyBox.childNodes) {
                replyBox.insertBefore(newCommentBox, replyBox.childNodes[0]);
            } else {
                replyBox.appendChild(newCommentBox);
            }
        }
    }

    connectedCallback() {
        const commentDisplay =
            this.shadowRoot.querySelector(".comment-display");
        commentDisplay.style.display = "none";
        this.shadowRoot
            .querySelector(".comment-submit")
            .addEventListener("click", () => this.commentSubmit());
        this.shadowRoot
            .querySelector(".reply-btn")
            .addEventListener("click", () => this.commentReply());
        this.shadowRoot
            .querySelector(".like-btn")
            .addEventListener("click", () => this.commentLike());
    }

    disconnectedCallback() {
        this.shadowRoot.querySelector(".comment-submit").removeEventListener();
    }
}
