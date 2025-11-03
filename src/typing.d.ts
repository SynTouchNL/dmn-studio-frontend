declare module 'dmn-js/lib/Modeler' {
    import BaseViewer from 'dmn-js/lib/base/Manager'; // or wherever it's from
    class Modeler extends BaseViewer {
        _viewers: any;
        importXML(xml: string): Promise<any>;
        saveXML(): Promise<{ xml: string }>;
        attachTo(element: HTMLElement | string): void;
        detach(): void;
        destroy(): void;
        getDefinitions(): void;
        open: (decision: any) => void;
        on(changed: string, param2: (event: any) => void) {}
        get(variableResolver: string) {}
    }

    export default Modeler;
}

declare module 'dmn-js/lib/Viewer' {
    import Manager from 'dmn-js/lib/base/Manager';

    class Viewer extends Manager {
        constructor(config: any);

        _getViewProviders(): any;

        importXML(xml: string): Promise<any>;

        attachTo(element: HTMLElement): void;

        destroy(): void;
    }

    export default Viewer;
}

declare module 'dmn-js/lib/NavigatedViewer' {
    import Manager from 'dmn-js/lib/base/Manager';

    class Viewer extends Manager {
        constructor(config: any);

        _getViewProviders(): any;

        importXML(xml: string): Promise<any>;

        attachTo(element: HTMLElement): void;

        destroy(): void;
    }

    export default NavigatedViewer;
}

declare module 'dmn-js/lib/Modeler' {
    export default class DmnModeler {
        get(arg0: string) {
            throw new Error("Method not implemented.");
        }
        on(arg0: string, arg1: (event: any) => void) {
            throw new Error("Method not implemented.");
        }
        open(arg0: ViewInterface) {
            throw new Error("Method not implemented.");
        }
        getDefinitions(): any {
            throw new Error('Method not implemented.');
        }
        private _viewers: any;
        saveXML(arg0: { format: boolean; }, p0: (err: any, xml: any) => void) {
            throw new Error('Method not implemented.');
        }
        constructor(config: any);
        importXML(xml: string): Promise<any>;
        attachTo(element: HTMLElement): void;
        destroy(): void;
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
