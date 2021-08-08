import React, { ReactNode } from "react";
import * as auth from "auth-provider";
import { User } from "types/user";
import { http } from "utils/http";
import { useMount } from "utils";
import { useAsync } from "utils/use-async";
import { FullPageErrorFallback, FullPageLoading } from "components/lib";

interface AuthForm {
  username: string;
  password: string;
}
/**
 * 获取 user 信息
 * @returns user
 */
const bootstrapUser = async () => {
  let user = null;
  const token = auth.getToken();
  if (token) {
    const data = await http("me", { token });
    user = data.user;
  }
  return user;
};
/**
 * 一个上下文对象;
 * 对外暴露给提供者 Provider(通常在组件树中上层的位置)和消费者(上下文内任何获取数据的组件)；
 * 在上下文之内的所有子组件都可以访问这个上下文环境之内的数据，并且不用通过props；
 */
const AuthContext = React.createContext<
  | {
      user: User | null;
      register: (form: AuthForm) => Promise<void>;
      login: (form: AuthForm) => Promise<void>;
      logout: () => Promise<void>;
    }
  | undefined
>(undefined);
AuthContext.displayName = "AuthContext";

/**
 * 提供者，为消费者提供 context 之内的数据
 * @param 需要渲染的子组件
 * @returns 一个具有组件和数据的父容器
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    run,
    setData: setUser,
  } = useAsync<User | null>();

  //为方便使用，将register,login,logout方法封装并暴露出去
  const register = (form: AuthForm) => auth.register(form).then(setUser);
  const login = (form: AuthForm) => auth.login(form).then(setUser);
  const logout = () => auth.logout().then(() => setUser(null));

  useMount(() => {
    run(bootstrapUser());
  });
  if (isIdle || isLoading) {
    return <FullPageLoading />;
  }
  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }
  return (
    <AuthContext.Provider
      children={children}
      value={{ user, login, register, logout }}
    />
  );
};

/**
 * 获取当前Context 中 Provider 提供的内容
 */
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth必须在AuthProvider中使用");
  }
  return context;
};
