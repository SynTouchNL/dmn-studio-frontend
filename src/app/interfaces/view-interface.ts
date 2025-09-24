export interface ViewInterface {
    id: string;
    name: string;
    type: string;
    element: any;
}

export interface ViewList extends Array<ViewInterface> {}
