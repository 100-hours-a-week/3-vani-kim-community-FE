// 더미 데이터 (ruined.script.js와 동일)
const RUINED_POSTS = [
    {
        id: 'ruined-1',
        title: '지옥에서 온 크루아상',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop',
        excerpt: '오븐 온도를 250도로 설정했는데... 화씨였습니다. 크루아상은 증발했고 남은 건 숯덩이뿐.',
        author: '제빵초보',
        likes: 999,
        comments: 42,
        category: '제빵',
        story: `첫 베이킹 도전기였습니다. 유튜브 보고 따라했는데 오븐 온도를 잘못 봤어요.
                250°F를 250°C로 착각해서... 5분만에 연기가 나더군요.
                소방서 올 뻔 했습니다. 엄마한테 혼났어요.

                <strong>교훈:</strong> 레시피 제대로 읽자. 화씨와 섭씨는 다르다.`
    },
    {
        id: 'ruined-2',
        title: '엘사가 녹아버린 케이크',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop',
        excerpt: '조카 생일 케이크를 만들었는데... 아이스크림 케이크인 줄 알고 상온에 뒀더니 엘사가 녹았습니다.',
        author: '이모의슬픔',
        likes: 856,
        comments: 67,
        category: '디저트',
        story: `조카 생일에 엘사 케이크를 직접 만들어주기로 했어요.
                3시간 동안 정성스럽게 데코했는데, 생크림 케이크인 줄 모르고 냉장고에 안 넣었습니다.
                2시간 뒤 확인했더니 엘사가 완전히 녹아서 슬러시가 되어있었어요.
                결국 편의점 케이크 샀습니다.

                <strong>교훈:</strong> 생크림 케이크는 냉장 필수. 엘사도 더위에는 약하다.`
    },
    {
        id: 'ruined-3',
        title: '용암 죽 (feat. 냄비)',
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop',
        excerpt: '아침에 죽을 끓이고 화장실 갔다가... 집이 불타는 줄 알았습니다. 냄비째로 타버렸어요.',
        author: '아침식사실패',
        likes: 1203,
        comments: 89,
        category: '한식',
        story: `간단하게 야채죽을 끓이고 있었습니다.
                물만 좀 넣으면 되는데 화장실이 급해서... 5분만 다녀오겠다고 생각했죠.
                그런데 유튜브를 보다가 20분이 지나갔습니다.
                돌아왔을 때는 이미 죽이 증발하고 냄비가 빨갛게 달아올라있었어요.
                연기 감지기가 울리고 이웃집 아저씨가 소화기 들고 오셨습니다.

                <strong>교훈:</strong> 요리 중엔 휴대폰 금지. 냄비는 새걸로 샀습니다.`
    },
    {
        id: 'ruined-4',
        title: '숯덩이 쿠키',
        image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=600&fit=crop',
        excerpt: '초콜릿 칩 쿠키를 구웠는데... 초콜릿인지 쿠키인지 숯인지 구분이 안 갑니다.',
        author: '쿠키몬스터좌절',
        likes: 734,
        comments: 51,
        category: '디저트',
        story: `크리스마스 선물로 직접 구운 쿠키를 주려고 했어요.
                레시피엔 180도 15분이라고 했는데, "바삭하게"를 원해서 200도로 올렸습니다.
                그리고 타이머 안 맞추고 설거지를 했죠.
                25분 뒤... 오븐에서 검은 원반이 나왔습니다.
                망치로 깨야 할 것 같은 경도였어요.

                <strong>교훈:</strong> 레시피는 과학이다. 내 맘대로 하면 안 된다.`
    },
    {
        id: 'ruined-5',
        title: '미확인 물체 (원래는 카레)',
        image: 'https://images.unsplash.com/photo-1585937421612-70e008356f1b?w=800&h=600&fit=crop',
        excerpt: '카레를 만들었는데... 이게 카레인지 수프인지 걸쭉한 물인지 모르겠습니다.',
        author: '요리는어려워',
        likes: 921,
        comments: 73,
        category: '양식',
        story: `친구들 초대해서 카레를 만들기로 했습니다.
                야채를 너무 많이 넣었고, 물도 너무 많이 넣었고, 카레 룰은 너무 적게 넣었어요.
                그래서 계속 끓이면서 농도를 맞추려고 했는데...
                야채가 다 녹아서 이상한 색깔의 액체가 되었습니다.
                친구들은 "특이한 스타일이네"라고 위로해줬지만 다들 한 숟가락만 먹었어요.

                <strong>교훈:</strong> 계량은 중요하다. 적당히는 없다.`
    },
    {
        id: 'ruined-6',
        title: '크툴루의 파스타',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop',
        excerpt: '오징어 먹물 파스타를 만들었는데... 외계 생명체가 된 기분입니다. 입 안이 검정.',
        author: '이탈리아의적',
        likes: 1567,
        comments: 124,
        category: '양식',
        story: `SNS에서 본 멋진 먹물 파스타를 따라해봤습니다.
                먹물을 얼마나 넣어야 하는지 몰라서 한 봉지 다 넣었어요.
                그 결과 면이 완전히 검정색으로 변했고, 소스도 검정, 접시도 검정...
                한 입 먹었더니 이빨이 검정색으로 물들었습니다.
                데이트 전이었는데 칫솔질 10번 했어요. 그래도 안 지워졌습니다.

                <strong>교훈:</strong> 먹물은 소량만. 데이트 전엔 절대 도전 금지.`
    }
];

// DOM Elements
const detailWrapper = document.getElementById('detail-wrapper');
const detailImage = document.getElementById('detail-image');
const detailCategory = document.getElementById('detail-category');
const detailTitle = document.getElementById('detail-title');
const detailAuthor = document.getElementById('detail-author');
const detailLikes = document.getElementById('detail-likes');
const detailComments = document.getElementById('detail-comments');
const detailExcerpt = document.getElementById('detail-excerpt');
const detailStoryContent = document.getElementById('detail-story-content');
const flipBtn = document.getElementById('flip-btn');

/**
 * URL에서 게시글 ID 가져오기
 */
function getPostIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

/**
 * 게시글 데이터 가져오기
 */
function getPostById(id) {
    return RUINED_POSTS.find(post => post.id === id);
}

/**
 * 상세 페이지 렌더링
 */
function renderDetailPage() {
    const postId = getPostIdFromUrl();

    if (!postId) {
        if (window.toast) {
            window.toast.error('게시글을 찾을 수 없습니다.');
        }
        window.location.href = '/ruined.html';
        return;
    }

    const post = getPostById(postId);

    if (!post) {
        if (window.toast) {
            window.toast.error('존재하지 않는 게시글입니다.');
        }
        window.location.href = '/ruined.html';
        return;
    }

    // 데이터 채우기
    detailImage.src = post.image;
    detailImage.alt = post.title;
    detailCategory.textContent = post.category;
    detailTitle.textContent = post.title;
    detailAuthor.textContent = `by ${post.author}`;
    detailLikes.textContent = post.likes;
    detailComments.textContent = post.comments;
    detailExcerpt.textContent = post.excerpt;

    // 스토리 HTML 파싱 (개행을 <p> 태그로 변환)
    const storyParagraphs = post.story
        .trim()
        .split('\n')
        .filter(p => p.trim() !== '')
        .map(p => `<p>${p.trim()}</p>`)
        .join('');
    detailStoryContent.innerHTML = storyParagraphs;

    // 페이지 타이틀 업데이트
    document.title = `${post.title} - 밥상 뒤집기`;
}

/**
 * 플립 버튼 이벤트
 */
function setupFlipButton() {
    flipBtn.addEventListener('click', () => {
        const isFlipped = detailWrapper.classList.contains('flipped');

        if (isFlipped) {
            // 정상으로
            detailWrapper.classList.remove('flipped');
            flipBtn.querySelector('span').textContent = '다시 뒤집기';
        } else {
            // 뒤집기
            detailWrapper.classList.add('flipped');
            flipBtn.querySelector('span').textContent = '정상으로 보기';
        }
    });
}

/**
 * 초기화
 */
document.addEventListener('DOMContentLoaded', () => {
    renderDetailPage();
    setupFlipButton();

    // Lucide 아이콘 렌더링
    if (window.lucide) {
        lucide.createIcons();
    }
});
