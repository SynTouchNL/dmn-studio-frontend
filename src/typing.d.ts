declare module 'dmn-js/lib/base/Manager' {
    export default class Manager {
        constructor(config?: any);
        get<T = any>(name: string): T;
        on(event: string, listener: (event: any) => void): void;
    }
}

declare module 'dmn-js/lib/Viewer' {
    import Manager from 'dmn-js/lib/base/Manager';
    export default class Viewer extends Manager {
        constructor(config?: any);
        _getViewProviders(): any;
        importXML(xml: string): Promise<any>;
        attachTo(element: HTMLElement): void;
        destroy(): void;
        get<T = any>(name: string): T;
        getDefinitions(): any;
        saveXML(options?: { format?: boolean }, cb?: (err: any, xml: any) => void): void; // added
        open(decision: any): void; // added
    }
}

declare module 'dmn-js/lib/NavigatedViewer' {
    import Manager from 'dmn-js/lib/base/Manager';
    import Viewer from 'dmn-js/lib/Viewer';
    export default class NavigatedViewer extends Manager {
        constructor(config?: any);
        _getViewProviders(): any;
        importXML(xml: string): Promise<any>;
        attachTo(element: HTMLElement): void;
        destroy(): void;
        get<T = any>(name: string): T;
        getDefinitions(): any;
        saveXML(options?: { format?: boolean }, cb?: (err: any, xml: any) => void): void; // added
        open(decision: any): void; // added
        getActiveViewer() : Manager | Viewer | NavigatedViewer
    }
}

declare module 'dmn-js/lib/Modeler' {
    import Manager from 'dmn-js/lib/base/Manager';
    import Viewer from 'dmn-js/lib/Viewer';
    import NavigatedViewer from 'dmn-js/lib/NavigatedViewer';
    export default class Modeler extends Manager {
        constructor(config?: any);
        _viewers: any;
        importXML(xml: string): Promise<any>;
        saveXML(options?: { format?: boolean }, cb?: (err: any, xml: any) => void): void;
        attachTo(element: HTMLElement | string): void;
        detach(): void;
        destroy(): void;
        getDefinitions(): any;
        open(decision: any): void;
        getActiveViewer(): Manager | Viewer | NavigatedViewer;
    }
}

declare module 'dmn-js-decision-table/lib/Viewer' {
    export default class DmnDecisionTable {
        constructor(config: any);
        static $inject: string[];
        getDecisionTable(): any;
        open: (decision: any) => void;
        close: () => void;
        attachTo: (element: HTMLElement) => void;
        detach: () => void;
        destroy: () => void;
    }
}

declare module 'dmn-js-properties-panel' {
    const DmnPropertiesPanelModule: any;
    const DmnPropertiesProviderModule: any;
    const CamundaPropertiesProviderModule: any;
    export { DmnPropertiesPanelModule, DmnPropertiesProviderModule, CamundaPropertiesProviderModule };
}

declare module '@bpmn-io/dmn-variable-resolver' {
    const DmnVariableResolverModule: any;
    export default DmnVariableResolverModule;
    export function resolveVariables(...args: any[]): any;
}

declare module 'camunda-dmn-moddle/resources/camunda.json';

declare module 'dmn-moddle' {
    import Moddle from 'moddle';
    const DmnModdle: Moddle;
    export default DmnModdle;
}

declare module 'moddle-xml' {
    export class Reader {
        fromXML(xml: string, callback: (err: any, moddleElement: any, context: any) => void): void;
    }
}
