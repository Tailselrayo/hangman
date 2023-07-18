import { Modal } from "@mantine/core";
import { ReactNode } from "react";

interface ModalHeaderlessProps {
    children: ReactNode;
    opened: boolean;
    onClose: () => void;
}

export function ModalHeaderless(props: ModalHeaderlessProps) {
    return (
        <Modal.Root 
            closeOnClickOutside={false}
            opened = {props.opened}
            onClose={props.onClose}
            transitionProps={{transition:"scale"}}
        >
            <Modal.Overlay blur={15}/>
            <Modal.Content>
                <Modal.Body>
                    {props.children}
                </Modal.Body>
            </Modal.Content>
        </Modal.Root>
    )
}