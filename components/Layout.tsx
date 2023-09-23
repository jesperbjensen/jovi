import {Children, cloneElement, PropsWithChildren} from "react";

export default function Layout({
  children,
  ...rest
}: PropsWithChildren<{}>) {
  // This is the layout component that wraps all the pages
  // It passes rest props to the children
  return (
    <html>
      <head>
        <title>My App</title>
        <link href="/app.css" rel="stylesheet" />
      </head>
      <body>

      {Children.map(children, (child) => {
          // Render the child and pass the rest props
          return cloneElement(child as any, rest);
        })}
      </body>
    </html>
  );
}
