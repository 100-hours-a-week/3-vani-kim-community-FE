import { logout } from "/src/features/auth/api/authApi.js";
import { getUser } from "/src/features/user/api/userApi.js";

/**
 * 레이아웃 관리 모듈
 * - 공통 레이아웃(헤더, 사이드바, 푸터) 로드
 * - 사용자 프로필 표시
 * - 로그아웃 처리
 */

document.addEventListener("DOMContentLoaded", function() {

    // 1. fetch로 layout.html 파일을 한 번만 가져옴
    fetch('/src/shared/component/layout.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('네트워크 응답 실패! (layout.html)');
            }
            return response.text();
        })
        .then(html => {
            // 2. 가져온 텍스트를 DOM 객체로 임시 변환
            // (DOMParser를 사용해 메모리 상에만 HTML을 만듦)
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // 3. 필요한 각 조각(header, sidebar, footer)을 ID로 찾음
            const headerHtml = doc.getElementById('layout-header')?.innerHTML;
            const sidebarHtml = doc.getElementById('layout-sidebar')?.innerHTML;
            const footerHtml = doc.getElementById('layout-footer')?.innerHTML;

            // 4. CSS 링크들을 <head>에 주입
            // (layout.html에 있던 <link> 태그들을 모두 찾아서 head에 추가)
            doc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
                document.head.appendChild(link);
            });

            // 5. 각 placeholder에 찾은 HTML 조각을 주입
            injectHtml('header-placeholder', headerHtml);
            injectHtml('sidebar-placeholder', sidebarHtml);
            injectHtml('footer-placeholder', footerHtml);

            //6. 헤더 주입 후, 프로필 로드 함수 호출
            loadUserProfile();

        })
        .catch(error => {
            console.error('레이아웃 로드 실패:', error);
            // 실패 시 모든 placeholder에 에러 메시지 표시
            injectHtml('header-placeholder', '<p>헤더 로드 실패</p>', true);
            injectHtml('sidebar-placeholder', '<p>사이드바 로드 실패</p>', true);
            injectHtml('footer-placeholder', '<p>풋터 로드 실패</p>', true);
        });
});

//드롭다운 토글
document.addEventListener('DOMContentLoaded', () =>{
    document.addEventListener('click', (event) => {

        const trigger = document.getElementById('user-menu-trigger');
        const dropdown = document.getElementById('user-dropdown');

        if(!trigger || !dropdown) return;

        // 프로필 아이콘을 클릭했는지 확인
        if (trigger.contains(event.target)) {
            dropdown.classList.add('show');
        }
        else if (!dropdown.contains(event.target)) {
            dropdown.classList.remove('show');
        }
    });

    //로그 아웃 버튼 로직
    // 나중에 생기니가 document에 위임
    document.addEventListener('click', (event) => {
        if (event.target.matches('#logout-button')) {
            event.preventDefault(); //a태그 기본 동작 방지(페이지 이동)
            handleLogout();
        }
    });
});


/**
 * 로그아웃 처리 함수
 * authStore를 사용하여 모든 인증 정보를 삭제하고 서버에 로그아웃 요청
 */
function handleLogout() {
    if (confirm("정말 로그아웃하시겠습니까?")) {

        // 1. authStore를 사용하여 localStorage와 sessionStorage의 모든 인증 정보 삭제
        //    (accessToken, currentUser 등 모든 인증 관련 데이터)
        window.authStore.clearAuth();

        // 2. 서버에 로그아웃 API 호출 (블랙리스트 처리, 리프레시 토큰 삭제 등)
        logout().catch(error => {
            // 서버 로그아웃 실패해도 클라이언트에서는 이미 토큰을 삭제했으므로 계속 진행
            console.error('서버 로그아웃 실패:', error);
        });

        // 3. 로그인 페이지로 리다이렉트
        alert("로그아웃되었습니다.");
        window.location.href = '/login';
    }
}

/**
 * 사용자 프로필 정보를 로드하여 헤더에 표시
 *
 * 최적화 전략:
 * 1. authStore에서 캐시된 사용자 정보를 먼저 확인 (빠름, 서버 요청 없음)
 * 2. authStore에 없는 경우에만 서버에서 조회 (느림, 서버 요청 필요)
 * 3. 서버에서 조회한 정보를 authStore에 저장하여 다음에 재사용
 */
async function loadUserProfile() {
    // 1. 인증 여부 확인 (토큰이 없으면 비로그인 상태)
    if (!window.authStore.isAuthenticated()) {
        console.log('로그인하지 않은 상태입니다.');
        return;
    }

    try {
        // 2. authStore에서 캐시된 사용자 정보 먼저 확인 (서버 요청 없이 빠르게 로드)
        let user = window.authStore.getUser();

        // 3. authStore에 사용자 정보가 없는 경우에만 서버에서 조회
        if (!user) {
            console.log('authStore에 사용자 정보가 없습니다. 서버에서 조회합니다.');
            user = await getUser();

            // 4. 조회한 사용자 정보를 authStore에 저장 (다음번 페이지 로드 시 재사용)
            window.authStore.setUser(user);
        } else {
            console.log('authStore에서 캐시된 사용자 정보를 사용합니다.');
        }

        // 5. 프로필 이미지 URL 가져오기 (편의 함수 사용)
        const profileImageUrl = window.authStore.getProfileImageUrl();

        // 6. 프로필 이미지가 없는 경우 기본 이미지 사용 또는 로그만 출력
        if (!profileImageUrl) {
            console.log('등록된 프로필 이미지가 없습니다.');
            return;
        }

        // 7. 헤더의 프로필 이미지 엘리먼트에 URL 설정
        const userImageElem = document.getElementById('user-menu-trigger');

        if (userImageElem) {
            userImageElem.src = profileImageUrl;
            userImageElem.alt = `${window.authStore.getNickname() || '사용자'}의 프로필`;
        } else {
            console.warn("'user-menu-trigger' <img> 태그를 찾을 수 없습니다.");
        }

    } catch (error) {
        console.error('사용자 프로필 로드 실패:', error);

        // 8. 에러 발생 시 (예: 토큰 만료) authStore 정리
        if (error.message && error.message.includes('401')) {
            console.log('인증 토큰이 만료되었습니다. 로그인 페이지로 이동합니다.');
            window.authStore.clearAuth();
            window.location.href = '/login';
        }
    }
}


/**
 * ID에 HTML을 주입하고, ID가 없는 경우 경고를 출력하는 헬퍼 함수
 * @param {string} id - HTML이 주입될 placeholder div의 ID
 * @param {string} html - 주입할 HTML 내용
 * @param {boolean} [isError=false] - 에러 상황인지 여부 (경고 무시)
 */
function injectHtml(id, html, isError = false) {
    const placeholder = document.getElementById(id);

    if (placeholder) {
        if (html) {
            placeholder.innerHTML = html;
        } else if (!isError) {
            console.warn(`layout.html에서 '#${id.replace('-placeholder', '')}' 조각을 찾지 못했습니다.`);
        }
    } else if (!isError) {
        // (예: 로그인 페이지에는 사이드바가 없을 수 있으므로, 이건 에러가 아님)
        console.warn(`'#${id}' 플레이스홀더가 현재 페이지에 없습니다.`);
    }
}

