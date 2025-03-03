import { createContext } from "react";

import type { ToastHandle } from "../library/Toast";

const ToastContext = createContext<React.RefObject<ToastHandle | null> | null>(null);

export default ToastContext;
