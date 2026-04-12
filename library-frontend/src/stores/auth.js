import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null,
  }),
  actions: {
    setLogin(data) {
      // Validate data structure
      if (!data || !data.token || !data.role || !data.userInfo) {
        console.error("Invalid login data structure:", data);
        throw new Error("Invalid server response: missing required fields");
      }

      this.user = data.userInfo;
      this.token = data.token;
      this.role = data.role;

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("user", JSON.stringify(data.userInfo));

      console.log("Login successful - stored in localStorage:", {
        token: data.token.substring(0, 20) + "...",
        role: data.role,
        user: data.userInfo,
      });
    },
    logout() {
      this.user = null;
      this.token = null;
      this.role = null;
      localStorage.clear();
    },
  },
});
