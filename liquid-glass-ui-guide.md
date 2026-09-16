# Hướng dẫn tích hợp Liquid Glass UI

Nguồn tham khảo: https://liquid-glass.maxrovensky.com/

## 1. Cài đặt

Đối với React/Next.js:

```bash
npm install liquid-glass-react
```

> Kiểm tra lại tên package và API theo phiên bản mới nhất của thư viện nếu npm báo lỗi.

## 2. Tạo component Glass dùng chung

Nên tạo một wrapper dùng cho Button, Card, Header, Dropdown, Input, Modal và Navigation.

```tsx
"use client";

import LiquidGlass from "liquid-glass-react";

interface GlassProps {
  children: React.ReactNode;
  className?: string;
  radius?: number;
}

export function Glass({
  children,
  className = "",
  radius = 16,
}: GlassProps) {
  return (
    <LiquidGlass
      displacementScale={40}
      blurAmount={0.08}
      saturation={130}
      aberrationIntensity={1.5}
      elasticity={0}
      cornerRadius={radius}
      className={className}
    >
      {children}
    </LiquidGlass>
  );
}
```

Các thông số chính cần tinh chỉnh:

- `displacementScale`: mức độ méo/khúc xạ.
- `blurAmount`: độ mờ nền.
- `saturation`: độ bão hòa màu.
- `aberrationIntensity`: hiệu ứng viền màu/quang sai.
- `elasticity`: độ đàn hồi khi tương tác.
- `cornerRadius`: bo góc.

## 3. Liquid Glass Button

```tsx
<Glass
  radius={10}
  className="
    inline-flex
    items-center
    justify-center
    gap-2
    px-5
    py-3
    text-sm
    font-medium
    text-white
    bg-[#0D5962]/75
    border border-white/20
    shadow-[0_8px_30px_rgba(13,89,98,0.18)]
    transition-all
    hover:bg-[#0D5962]/85
    hover:scale-[1.02]
    active:scale-[0.98]
  "
>
  Get Started
</Glass>
```

CSS fallback:

```css
.glass-button {
  background: rgba(13, 89, 98, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    0 8px 32px rgba(13, 89, 98, 0.18);
}
```

Không nên kết hợp quá nhiều màu gradient. Với giao diện VINEX nên dùng một màu teal chủ đạo, thay đổi độ sáng theo trạng thái.

## 4. Liquid Glass Card

```tsx
<Glass
  radius={20}
  className="
    relative
    overflow-hidden
    p-6
    bg-white/[0.08]
    border border-white/[0.16]
    shadow-[0_20px_60px_rgba(0,0,0,0.08)]
  "
>
  <div className="relative z-10">
    <p className="text-sm text-white/60">
      Total Revenue
    </p>

    <h3 className="mt-2 text-3xl font-semibold text-white">
      $128,420
    </h3>
  </div>
</Glass>
```

Cấu trúc card nên gồm:

1. Refraction/distortion.
2. Background tint.
3. Border highlight.
4. Nội dung.
5. Soft shadow.

CSS fallback:

```css
.glass-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(24px) saturate(140%);
  -webkit-backdrop-filter: blur(24px) saturate(140%);

  border: 1px solid rgba(255, 255, 255, 0.16);

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    0 20px 60px rgba(0, 0, 0, 0.08);
}
```

## 5. Glass Header / Navbar

```tsx
<Glass
  radius={14}
  className="
    fixed
    top-4
    left-1/2
    z-50
    w-[calc(100%-32px)]
    max-w-7xl
    -translate-x-1/2
    px-4
    py-3
    bg-white/[0.06]
    border border-white/[0.14]
  "
>
  <nav className="flex items-center justify-between">
    <Logo />

    <div className="flex items-center gap-2">
      <NavItem active>Home</NavItem>
      <NavItem>Services</NavItem>
      <NavItem>Contact</NavItem>
    </div>

    <Glass radius={8} className="px-4 py-2">
      Contact Us
    </Glass>
  </nav>
</Glass>
```

Active menu:

```tsx
<div
  className="
    rounded-lg
    bg-[#0D5962]/80
    border border-white/20
    px-3 py-2
    text-white
    shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]
  "
>
  Services
</div>
```

## 6. Glass Input

```tsx
<input
  className="
    h-11
    w-full
    rounded-xl
    bg-white/[0.07]
    border border-white/[0.14]
    px-4
    text-sm
    text-white
    outline-none
    placeholder:text-white/40
    backdrop-blur-xl
    transition
    focus:border-[#0D5962]/70
    focus:bg-white/[0.10]
  "
  placeholder="Enter your email"
/>
```

Input nên có distortion thấp để không ảnh hưởng khả năng đọc.

## 7. Glass Dropdown / Select

```tsx
<div
  className="
    rounded-xl
    bg-[#102f35]/75
    border border-white/15
    p-1
    shadow-2xl
    backdrop-blur-2xl
  "
>
  <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-white hover:bg-white/10">
    Select service
    <ChevronDown size={16} />
  </button>

  <div className="mt-1 space-y-1">
    <div className="rounded-lg bg-[#0D5962]/70 px-3 py-2 text-sm text-white">
      Website Design
    </div>

    <div className="rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10">
      CMS Development
    </div>
  </div>
</div>
```

## 8. Thông số đề xuất theo component

| Component | Displacement | Blur | Opacity |
|---|---:|---:|---:|
| Header | 20–35 | Thấp | 5–10% |
| Button | 30–50 | Trung bình | 60–80% |
| Card | 40–70 | Trung bình | 8–15% |
| Input | 10–20 | Thấp | 5–8% |
| Dropdown | 20–40 | Cao | 70–85% |
| Modal | 30–50 | Cao | 70–90% |
| Active menu | 20–30 | Thấp | 60–75% |

## 9. Background phù hợp

Liquid Glass chỉ đẹp khi nền phía sau có chiều sâu. Nên dùng:

- Radial gradient nhẹ.
- Blob màu teal.
- Noise texture.
- Abstract shapes.
- Ánh sáng trắng hoặc teal mờ.

Ví dụ:

```tsx
<div className="relative min-h-screen overflow-hidden bg-[#071b20]">
  <div
    className="
      pointer-events-none
      absolute
      -left-40
      top-20
      h-[500px]
      w-[500px]
      rounded-full
      bg-[#0D5962]/30
      blur-[140px]
    "
  />

  <div
    className="
      pointer-events-none
      absolute
      right-[-100px]
      top-[30%]
      h-[400px]
      w-[400px]
      rounded-full
      bg-[#5C7B6C]/20
      blur-[130px]
    "
  />

  <main className="relative z-10">
    ...
  </main>
</div>
```

## 10. Kiến trúc Design System

Không nên gắn LiquidGlass trực tiếp ở từng nơi. Hãy tạo các component dùng chung:

```text
components/
└── ui/
    ├── glass/
    │   ├── glass.tsx
    │   ├── glass-button.tsx
    │   ├── glass-card.tsx
    │   ├── glass-input.tsx
    │   ├── glass-header.tsx
    │   └── glass-modal.tsx
    │
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    └── dropdown.tsx
```

API nên hướng tới:

```tsx
<GlassButton variant="primary">
  Get Started
</GlassButton>

<GlassButton variant="secondary">
  Learn More
</GlassButton>

<GlassCard variant="default">
  ...
</GlassCard>

<GlassCard variant="elevated">
  ...
</GlassCard>
```

## 11. Design tokens đề xuất cho VINEX

```text
Primary:
#0D5962

Glass background:
rgba(255,255,255,0.07)

Glass border:
rgba(255,255,255,0.16)

Glass highlight:
rgba(255,255,255,0.22)

Text:
#FFFFFF

Muted text:
rgba(255,255,255,0.60)

Shadow:
0 20px 60px rgba(0,0,0,0.10)

Radius:
8px  → buttons, inputs
12px → menu, small cards
20px → main cards
28px → hero panels
```

## 12. Nguyên tắc sử dụng

- Chỉ dùng Liquid Glass cho khoảng 20–40% thành phần giao diện.
- Không làm mọi thành phần đều trong suốt và blur.
- Button cần đủ tương phản để dễ nhận biết.
- Input và text area nên dùng distortion thấp.
- Card lớn có thể dùng displacement cao hơn.
- Header nên có opacity thấp và border tinh tế.
- Giữ một màu chủ đạo teal thay vì gradient nhiều màu.
- Luôn có CSS fallback bằng `backdrop-filter`.
- Hiệu ứng refraction đầy đủ hoạt động tốt nhất trên Chromium; cần kiểm tra Safari và Firefox.

