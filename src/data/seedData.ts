import { Post, Community, UserProfile, TrendTag, TopicItem } from "../types";

export const INITIAL_TRENDS: TrendTag[] = [
  { tag: "#AI", category: "Công nghệ", postsCount: 1420, growth: "+48%", isHot: true },
  { tag: "#GenZ", category: "Đời sống", postsCount: 3250, growth: "+32%", isHot: true },
  { tag: "#StudyTips", category: "Học tập", postsCount: 980, growth: "+25%", isHot: false },
  { tag: "#DaLat", category: "Du lịch", postsCount: 840, growth: "+19%", isHot: false },
  { tag: "#CareerPath", category: "Định hướng", postsCount: 1120, growth: "+41%", isHot: true },
  { tag: "#CafeSaiGon", category: "Đời sống", postsCount: 760, growth: "+14%", isHot: false },
  { tag: "#Photography", category: "Sáng tạo", postsCount: 650, growth: "+21%", isHot: false },
];

export const INITIAL_TOPICS: TopicItem[] = [
  { id: "tech", name: "Công nghệ", icon: "💻", description: "Lập trình, AI, Gadgets & Tương lai số", postCount: 2450, color: "from-blue-500/10 to-indigo-500/10" },
  { id: "learn", name: "Học tập", icon: "📚", description: "Học bổng, tiếng Anh, bí kíp thi cử", postCount: 1890, color: "from-emerald-500/10 to-teal-500/10" },
  { id: "career", name: "Nghề nghiệp", icon: "💼", description: "CV chuẩn, phỏng vấn, thực tập & việc làm", postCount: 1620, color: "from-amber-500/10 to-orange-500/10" },
  { id: "game", name: "Game & Esports", icon: "🎮", description: "Cộng đồng gamer, review game, giải đấu", postCount: 1430, color: "from-purple-500/10 to-pink-500/10" },
  { id: "travel", name: "Du lịch bụi", icon: "✈️", description: "Check-in, kinh nghiệm phượt, homestay", postCount: 1150, color: "from-sky-500/10 to-cyan-500/10" },
  { id: "photo", name: "Chụp ảnh", icon: "📷", description: "Tips chụp điện thoại, Lightroom presets", postCount: 940, color: "from-rose-500/10 to-red-500/10" },
  { id: "music", name: "Âm nhạc & Indie", icon: "🎧", description: "Playlist chill, concert, nghệ sĩ trẻ", postCount: 1280, color: "from-violet-500/10 to-purple-500/10" },
  { id: "cafe", name: "Cafe & Chill", icon: "☕", description: "Quán cafe làm việc đẹp, review đồ uống", postCount: 870, color: "from-yellow-500/10 to-amber-500/10" },
  { id: "startup", name: "Khởi nghiệp", icon: "🚀", description: "Dự án sinh viên, gọi vốn, kinh doanh nhỏ", postCount: 720, color: "from-blue-600/10 to-cyan-600/10" },
];

export const INITIAL_COMMUNITIES: Community[] = [
  {
    id: "genz-ai",
    name: "Gen Z Học & Ứng Dụng AI",
    description: "Cộng đồng thảo luận về Gemini, ChatGPT, Claude, Midjourney và cách tự động hóa học tập, công việc.",
    avatar: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=200&q=80",
    cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    topic: "Công nghệ",
    ownerId: "system_admin",
    ownerName: "CùngNè Team",
    membersCount: 4280,
    postsCount: 520,
    createdAt: new Date().toISOString(),
    ruleList: ["Chia sẻ bài viết hữu ích", "Không spam quảng cáo", "Tôn trọng góc nhìn đa chiều"]
  },
  {
    id: "cafe-saigon",
    name: "Cộng Đồng Mê Cafe Sài Gòn",
    description: "Tìm kiếm góc quán cafe yên tĩnh để chạy deadline, chụp ảnh sống ảo và thưởng thức specialty coffee.",
    avatar: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=200&q=80",
    cover: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80",
    topic: "Đời sống",
    ownerId: "system_admin",
    ownerName: "Minh Trang",
    membersCount: 2950,
    postsCount: 380,
    createdAt: new Date().toISOString(),
    ruleList: ["Review chân thật", "Kèm địa chỉ & giá tiền", "Không seeding độc hại"]
  },
  {
    id: "student-it",
    name: "Sinh Viên IT & Lập Trình Viên Trẻ",
    description: "Hỏi đáp code, review CV thực tập, chia sẻ tài liệu thuật toán, web/mobile dev và lộ trình học.",
    avatar: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=200&q=80",
    cover: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    topic: "Học tập",
    ownerId: "system_admin",
    ownerName: "Huy IT",
    membersCount: 6100,
    postsCount: 890,
    createdAt: new Date().toISOString(),
    ruleList: ["Format code rõ ràng", "Tự search trước khi hỏi", "Cùng nhau tiến bộ"]
  },
  {
    id: "street-photo",
    name: "Cộng Đồng Mê Chụp Ảnh Đường Phố",
    description: "Nơi khoe ảnh phố xá Việt Nam, chia sẻ preset Lightroom màu cinematic và kỹ thuật bắt trọn khoảnh khắc.",
    avatar: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=200&q=80",
    cover: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80",
    topic: "Sáng tạo",
    ownerId: "system_admin",
    ownerName: "Bảo Long",
    membersCount: 3120,
    postsCount: 460,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: "post_1",
    authorId: "user_huy",
    authorName: "Nguyễn Huy",
    authorUsername: "huynguyen",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    authorBadge: "Super Creator",
    authorVerified: true,
    content: "🚀 Gemini 2.5 Flash thực sự đang thay đổi cách sinh viên học tập! Mình dùng nó để tóm tắt các bài giảng 50 trang thành Mindmap trong 15 giây và test câu hỏi trắc nghiệm trước kỳ thi. \n\nMọi người đã tận dụng AI vào việc học như thế nào rồi? Cùng chia sẻ tips bên dưới nha! 👇",
    images: ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80"],
    category: "Công nghệ",
    hashtags: ["#AI", "#StudyTips", "#Gemini", "#GenZ"],
    likesCount: 128,
    reactions: { love: 84, fire: 32, like: 12 },
    commentsCount: 34,
    sharesCount: 15,
    bookmarksCount: 42,
    visibility: "public",
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString()
  },
  {
    id: "post_2",
    authorId: "user_linh",
    authorName: "Linh Đan",
    authorUsername: "linhdan_travel",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    authorBadge: "Bắt trend",
    authorVerified: true,
    content: "🌲 Cuối tuần này có bạn nào tính đi trốn ở Đà Lạt không nè? Thời tiết mấy hôm nay siêu mát lạnh, sương sớm đẹp mê mẩn luôn. \n\nMình vừa phát hiện ra một quán cafe view đồi thông cực chill không bị đông khách. Cmt mình gửi toạ độ nha! ☕✨",
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1000&q=80"
    ],
    category: "Đời sống",
    hashtags: ["#DaLat", "#Travel", "#CafeSaiGon", "#Chill"],
    likesCount: 256,
    reactions: { love: 180, fire: 50, wow: 26 },
    commentsCount: 68,
    sharesCount: 29,
    bookmarksCount: 88,
    visibility: "public",
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  },
  {
    id: "post_3",
    authorId: "user_minh",
    authorName: "Trần Minh",
    authorUsername: "minh_career",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    authorBadge: "Mentor",
    authorVerified: true,
    content: "💼 3 sai lầm phổ biến nhất trong CV của sinh viên mới tốt nghiệp mà nhà tuyển dụng thường lướt qua chỉ trong 6 giây:\n\n1. Mô tả công việc thay vì liệt kê KẾT QUẢ ĐO LƯỜNG ĐƯỢC (Impact)\n2. Dùng font chữ và màu sắc quá rối mắt\n3. Không tùy chỉnh CV theo Job Description của từng vị trí\n\nBạn nào đang chuẩn bị nộp CV thực tập có thể ghé mục Career Hub để CùngNè AI góp ý nhé! 🎯",
    images: [],
    category: "Định hướng",
    hashtags: ["#CareerPath", "#CV", "#Interview", "#GenZJobs"],
    likesCount: 310,
    reactions: { like: 190, love: 90, fire: 30 },
    commentsCount: 52,
    sharesCount: 84,
    bookmarksCount: 145,
    visibility: "public",
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString()
  },
  {
    id: "post_4",
    authorId: "user_phuong",
    authorName: "Phương Anh",
    authorUsername: "phuonganh_art",
    authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    authorBadge: "Chia sẻ kiến thức",
    authorVerified: false,
    content: "📷 3 mẹo chụp ảnh đường phố bằng smartphone để có ảnh chất như máy cơ:\n\n1. Chuyển sang chụp góc 2x hoặc 3x để bớt méo và tập trung chủ thể\n2. Tận dụng bóng đổ (shadows) và ánh nắng xiên lúc 4h-5h chiều\n3. Hạ thanh phơi sáng (exposure) xuống một chút để màu đậm đà hơn.",
    images: ["https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1000&q=80"],
    category: "Sáng tạo",
    hashtags: ["#Photography", "#Tips", "#GenZ"],
    likesCount: 184,
    reactions: { love: 110, fire: 64, wow: 10 },
    commentsCount: 19,
    sharesCount: 12,
    bookmarksCount: 65,
    visibility: "public",
    createdAt: new Date(Date.now() - 1000 * 60 * 720).toISOString()
  }
];

export const SUGGESTED_USERS = [
  {
    uid: "user_huy",
    displayName: "Nguyễn Huy",
    username: "huynguyen",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    bio: "Passionate about AI, Tech & Startups 🚀",
    interests: ["AI", "Lập trình", "Công nghệ", "Khởi nghiệp"],
    sharedInterestsCount: 4,
    verified: true
  },
  {
    uid: "user_linh",
    displayName: "Linh Đan",
    username: "linhdan_travel",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    bio: "Traveler & Food Lover ☕✈️",
    interests: ["Du lịch", "Cafe", "Chụp ảnh", "Âm nhạc"],
    sharedInterestsCount: 3,
    verified: true
  },
  {
    uid: "user_minh",
    displayName: "Trần Minh",
    username: "minh_career",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    bio: "HR & Career Coach for Gen Z 💼",
    interests: ["Nghề nghiệp", "Học tập", "Kỹ năng sống", "Kinh doanh"],
    sharedInterestsCount: 3,
    verified: true
  }
];
