# 🍚 밥상머리 (Babsangmeori)
> **사랑하는 사람의 요리법이 잊혀지기 전에 기록하는 아카이빙 커뮤니티**

<br/>

<div align="center">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white"/>
  <img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"/>
</div>

<br/>

## 1. 프로젝트 소개
**"엄마의 손맛, 기록하지 않으면 사라지니까요."**

**밥상머리**는 소중한 사람들의 레시피를 기록하고 추억을 공유하는 커뮤니티 서비스입니다.
프레임워크(React, Vue 등)의 도움 없이 **Vanilla JS**와 **Express.js**를 활용하여 SPA(Single Page Application)와 유사한 사용자 경험을 직접 구현하며 웹의 본질적인 동작 원리를 깊이 있게 학습했습니다.

- **개발 기간:** 2025.10.16 ~ 2024.12.08 and Continue
- **개발 인원:** 1인 (Full-stack)
- **배포 URL:** [밥상머리 바로가기](https://vanicommu.click/landing)
- **관련 리포지토리:** [Back-end Github 바로가기](https://github.com/100-hours-a-week/3-vani-kim-community-BE)

<br/>

## 2. 기술 스택 (Tech Stack)

| 구분 | 기술 |
| :-: | - |
| **Frontend** | <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black"/> <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white"/> <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white"/> |
| **Server** | <img src="https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white"/> (Frontend Serving & Proxy) |
| **Infra & DevOps** | <img src="https://img.shields.io/badge/AWS_EC2-FF9900?style=flat-square&logo=amazonaws&logoColor=white"/> <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white"/> <img src="https://img.shields.io/badge/Nginx-009639?style=flat-square&logo=nginx&logoColor=white"/> <img src="https://img.shields.io/badge/Github_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white"/> |

<br/>

## 3. 핵심 기능 및 화면

### 🔐 인증 (Authentication)
사용자 보안을 고려한 회원가입 및 로그인 프로세스입니다.

| 로그인 | 회원가입 |
| :--: | :--: |
| ![Login](/docs/login.png) | ![Signup](/docs/signup.png) |

### 📝 게시판 (Board)
레시피를 기록하고 공유하는 메인 공간입니다.

| 게시글 목록 | 게시글 상세 |
| :--: | :--: |
| ![Main](/docs/main.png) | ![Detail](/docs/post.png) |

| 글 작성 | 글 수정 |
| :--: | :--: |
| ![Create](/docs/post_create.png) | ![Update](/docs/post_update.png) |

### 💬 소통 (Comment)
게시글에 대한 추억과 의견을 나누는 댓글 기능입니다.

| 댓글 목록 및 작성 | 댓글 수정 및 삭제 |
| :--: | :--: |
| ![Comment](/docs/comment.png) | ![Comment_Edit](/docs/comment_update.png) |

### 👤 마이페이지 (My Page)
개인 정보를 안전하게 관리합니다.

| 프로필 수정 | 비밀번호 변경 |
| :--: | :--: |
| ![Profile](/docs/user_update.png) | ![Password](/docs/password_change.png) |

<br/>

## 4. 폴더 구조 (Directory Structure)
<details>
<summary><b>📂 폴더 구조 펼쳐보기</b></summary>
<div markdown="1">

```bash
├── .github/workflows     # CI/CD 파이프라인 설정
├── public
│   ├── assets            # 정적 리소스 (폰트, 이미지 등)
│   ├── global.css        # 전역 스타일
│   ├── index.html        # 진입점
│   └── src
│       ├── core          # 핵심 로직 (API 클라이언트 등)
│       ├── features      # 도메인별 기능 (Auth, Post, User 등)
│       └── shared        # 공용 컴포넌트 (Header, Modal 등)
├── dockerfile            # Docker 이미지 빌드 설정
├── index.js              # Express 서버 진입점
└── package.json
```
</div> 
</details>
<br/>

## 트러블 슈팅

추후 작성 ...

<br/>

## 프로젝트 후기
"맨땅에 헤딩으로 쌓아 올린 프론트엔드 아키텍처"

프론트엔드에 대한 지식이 전무한 상태에서 시작했습니다. 라이브러리에 의존하기보다 순수 JavaScript와 HTML 구조 설계를 통해 DOM 조작과 이벤트 위임 등 웹의 기본기를 탄탄히 다질 수 있었습니다.

특히 프로젝트 후반부에는 Nginx의 리버스 프록시 및 캐싱 전략을 직접 다루며 프론트엔드와 서버 간의 통신 과정을 깊이 이해하게 되었습니다. 또한 AI 도구(Gemini 등)를 활용할 때도 단순 복사 붙여넣기가 아니라, **'어떤 프롬프트 입력해야 원하는 아키텍처를 얻을 수 있는가'** 와 **어떻게 해야 토큰을 아낄 수 있는가?** 에 대한 전략적 접근이 중요하다는 것을 깨달았습니다.

이 프로젝트는 단순히 기술을 익히는 것을 넘어, **"엄마의 요리를 기록한다"** 는 생각으로 확장해 나갈 프로젝트입니다. (2025.12.08)
<br/>
