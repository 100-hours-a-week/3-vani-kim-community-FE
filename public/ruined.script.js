// 더미 데이터: 망한 요리 6개
const RUINED_POSTS = [
    {
        id: 'ruined-1',
        title: '닭도 안먹는 최악의 음식',
        image: '/assets/images/ruined/chix01.jpg',
        excerpt: '자신감 넘쳤던 나의 첫 요리... 결과는 참담했습니다. 닭도 거들떠보지 않는 비주얼.',
        author: '요리포기',
        likes: 999,
        comments: 42,
        category: '실패작',
        story: `처음으로 집에서 요리를 해봤습니다. 레시피를 보고 따라했는데...
                뭔가 이상했어요. 색깔도 이상하고 냄새도 이상하고.
                자신있게 가족들 앞에 내놨더니 다들 침묵했습니다.
                심지어 키우던 닭에게 줬더니 쳐다도 안 보더군요.

                <strong>교훈:</strong> 자신감도 좋지만 기본은 지키자. 소금과 설탕은 다르다.`
    },
    {
        id: 'ruined-2',
        title: '녹아버린 케이크',
        image: '/assets/images/ruined/cake.jpg',
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
        image: '/assets/images/ruined/burn.jpg',
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
        image: '/assets/images/ruined/cookie.jpg',
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
        image: '/assets/images/ruined/curry.jpg',
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
        image: '/assets/images/ruined/pasta.jpg',
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
const splashScreen = document.getElementById('splash-screen');
const ruinedGrid = document.getElementById('ruined-grid');
const cardTemplate = document.getElementById('ruined-card-template');

/**
 * 랜덤 로테이션 각도 생성 (-5 ~ 5)
 */
function getRandomRotation() {
    return Math.floor(Math.random() * 11) - 5; // -5 ~ 5
}

/**
 * 카드 DOM 생성
 */
function createRuinedCard(post) {
    const cardFragment = cardTemplate.content.cloneNode(true);
    const card = cardFragment.querySelector('.ruined-card');

    // 데이터 설정
    card.dataset.id = post.id;
    const rotation = getRandomRotation();
    card.dataset.rotation = rotation;
    card.style.setProperty('--rotation', rotation);

    // 요소 선택
    const cardImage = cardFragment.querySelector('.card-image');
    const cardCategory = cardFragment.querySelector('.card-category');
    const cardTitle = cardFragment.querySelector('.card-title');
    const cardAuthor = cardFragment.querySelector('.card-author');
    const likesStat = cardFragment.querySelector('.stat-item:nth-of-type(1) .stat-number');
    const commentsStat = cardFragment.querySelector('.stat-item:nth-of-type(2) .stat-number');
    const cardExcerpt = cardFragment.querySelector('.card-excerpt');
    const detailBtn = cardFragment.querySelector('.detail-btn');

    // 데이터 채우기
    cardImage.src = post.image;
    cardImage.alt = post.title;
    cardCategory.textContent = post.category;
    cardTitle.textContent = post.title;
    cardAuthor.textContent = `by ${post.author}`;
    likesStat.textContent = post.likes;
    commentsStat.textContent = post.comments;
    cardExcerpt.textContent = post.excerpt;

    // 카드 클릭 시 플립
    card.addEventListener('click', (e) => {
        // 상세보기 버튼 클릭은 제외
        if (e.target.closest('.detail-btn')) return;
        card.classList.toggle('is-flipped');
    });

    // 상세보기 버튼 클릭
    detailBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.location.href = `/ruined-detail?id=${post.id}`;
    });

    return cardFragment;
}

/**
 * 모든 카드 렌더링
 */
function renderCards() {
    RUINED_POSTS.forEach(post => {
        const cardElement = createRuinedCard(post);
        ruinedGrid.appendChild(cardElement);
    });

    // Lucide 아이콘 렌더링
    if (window.lucide) {
        lucide.createIcons();
    }
}

/**
 * 스플래시 스크린 제어
 */
function hideSplashScreen() {
    setTimeout(() => {
        splashScreen.classList.remove('active');
        setTimeout(() => {
            splashScreen.style.display = 'none';
        }, 500);
    }, 2500); // 2.5초 후 사라짐
}

/**
 * Chaos Scroll 효과 (선택사항)
 * 스크롤 시 카드들이 살짝 흔들림
 */
let lastScrollY = 0;
let ticking = false;

function chaosScrollEffect() {
    const cards = document.querySelectorAll('.ruined-card');
    const scrollDelta = window.scrollY - lastScrollY;

    if (Math.abs(scrollDelta) > 10) {
        cards.forEach((card, index) => {
            // 랜덤하게 일부 카드만 흔들림
            if (Math.random() > 0.7) {
                card.classList.add('chaos-shake');
                setTimeout(() => {
                    card.classList.remove('chaos-shake');
                }, 500);
            }
        });
    }

    lastScrollY = window.scrollY;
    ticking = false;
}

function onScroll() {
    if (!ticking) {
        window.requestAnimationFrame(chaosScrollEffect);
        ticking = true;
    }
}

/**
 * 초기화
 */
document.addEventListener('DOMContentLoaded', () => {
    // 스플래시 스크린 표시
    hideSplashScreen();

    // 카드 렌더링
    renderCards();

    // Chaos Scroll 효과 비활성화
    // window.addEventListener('scroll', onScroll, { passive: true });

    // Lucide 아이콘 초기 렌더링
    if (window.lucide) {
        lucide.createIcons();
    }
});

// 더미 데이터를 전역으로 export (상세 페이지에서 사용)
window.RUINED_POSTS = RUINED_POSTS;
