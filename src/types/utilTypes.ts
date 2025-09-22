export type Component = (props: ComponentProps) => string | Promise<string>;

export type ComponentProps = {
    rid: string
    [key: string]: any;
};

