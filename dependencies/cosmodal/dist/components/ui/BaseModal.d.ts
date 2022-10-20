import { FunctionComponent, PropsWithChildren, ReactElement, ReactNode } from "react";
import { ModalClassNames } from "../../types";
export declare type BaseModalProps = PropsWithChildren<{
    isOpen: boolean;
    onClose?: () => void;
    title?: ReactElement | string;
    maxWidth?: string;
    classNames?: ModalClassNames;
    closeIcon?: ReactNode;
}>;
export declare const BaseModal: FunctionComponent<BaseModalProps>;
export declare const ModalSubheader: import("styled-components").StyledComponent<"div", any, {}, never>;
//# sourceMappingURL=BaseModal.d.ts.map