import { deletePost } from "/src/features/posts/api/postApi.js";

document.addEventListener("DOMContentLoaded", function() {})

// 게시글 상세페이지 조회를 위해 게시글에 관한 함수를 모아놓은 파일
//게시글 렌더링 시작
export function renderPost(post) {
    const title = post.title;
    const author = post.author.nickname;
    const postImageUrl = post.contentDetail.postImageUrl;

    document.getElementById("post-title").textContent = post.title;
    document.getElementById("post-author-id").textContent = post.author.nickname;
    // TODO 유저의 아이디가 반환값이 없음 수정 필요(유저 프로필 누르면 유저 정보페이지 이동용), 타인이 볼 수 있는 유저 페이지 확장 필요
    // document.getElementById("post-author-link").href = `/user/${post.authorId}`;

    const postDate = document.getElementById("post-date");
    // 보여줄 시간
    postDate.textContent = new Date(post.createdAt).toLocaleString();
    // 검색엔진 등에 노출되는 기계가 보는 시간
    postDate.dateTime = post.createdAt;

    const postImageElem = document.getElementById('post-img');

    if (postImageElem) {
        postImageElem.src = postImageUrl;
    } else {
        console.warn("'post-img' <img> 태그를 찾을 수 없습니다.")
    }


    document.getElementById("post-body").textContent = post.contentDetail.content;

    document.getElementById('post-likes').textContent = `좋아요수 ${post.stats.likeCount}`
    document.getElementById('post-views').textContent = `조회수 ${post.stats.viewCount}`
    document.getElementById('post-comments').textContent = `댓글수 ${post.stats.commentCount}`

    //작성자 권한 탐색, 수정/삭제 버튼 생성
    setupPostActionListeners(post)
}

/**
 * 게시글의 액션(수정삭제)를 DOM으로 동적으로 생성하는 메서드
 * 권한을 가진사람에게만 보여야하므로 권한 확인후 생성
 * 버튼 렌더링과 이벤트 연결
 * */
export function setupPostActionListeners(post) {
    const postActions = document.getElementById("post-actions");
    const currentUser = sessionStorage.getItem("currentUser");
    if(post.author.nickname === currentUser) {
        //DOM API로 버튼 생성하기
        //innerHTML은 간단하지만 리스키함
        const editLink = document.createElement("a");
        editLink.href = `/post/${post.postId}/edit`;
        editLink.className = 'button';
        editLink.textContent = '수정';

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.textContent ='삭제';
        //JS 에서 직접 이벤트 리스너 연결
        //페이지 처음 로드할때는 없었으니까
        deleteBtn.addEventListener('click', () =>{
            handleDeletePost(post.postId);
        })

        postActions.appendChild(editLink);
        postActions.appendChild(deleteBtn);

    }
}



// 게시글 삭제하기
async function handleDeletePost(postId) {
    if (confirm("정말 삭제하시겠습니까?")) {
        try {
            await deletePost(postId);
            alert('삭제되었습니다.');
            window.location.href = '/index'; // 메인으로
        } catch (error) {
            console.error('삭제 실패:', error);
            alert('삭제에 실패했습니다.');
        }
    }
}


