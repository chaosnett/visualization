import * as React from "react";

export interface IHeaderProps {
  title: string;
  className?: string;
}

export function Header(props: IHeaderProps) {
  return (
    <div
      className={`font-array text-8xl font-bold tracking-wide drop-shadow-xl ${props.className}`}
    >
      {props.title}
    </div>
  );
}
