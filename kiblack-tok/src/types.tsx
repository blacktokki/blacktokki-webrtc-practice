/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

export type RootStackParamList = {
  Drawer: undefined;
  NotFound: undefined;
};

export type ResponsiveNavigatorItemProps = {label:string, isFocused:boolean, navigate:()=>void}
export type ResponsiveNavigatorProps = {data:ResponsiveNavigatorItemProps[]}