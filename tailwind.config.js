/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  // 다크모드는 보통 환경설정을 따라간다. => 기본으로 'media'로 설정되어 있다.
  // darkMode를 class로 변경하면 수동으로 다크모드를 적용할 수 있다.
  // 부모요소 className에 dark가 있으면 자식요소들은 dark Modifiers를 이용해 다크모드를 적용할 수 있다.
  darkMode: "media", // class
  plugins: [],
};
