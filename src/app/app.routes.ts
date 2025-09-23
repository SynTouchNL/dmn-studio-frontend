import { Routes } from '@angular/router';
import { NotFoundView } from './views/etc/not-found-view/not-found-view';

import { IndexView } from './views/etc/index-view/index-view';
import { DmnListView } from './views/dmn/dmn-list-view/dmn-list-view';
import { DmnDetailView } from './views/dmn/dmn-detail-view/dmn-detail-view';
import { DiagramEditorView } from './views/diagram/diagram-editor-view/diagram-editor-view';
import { DiagramReadonlyView } from './views/diagram/diagram-readonly-view/diagram-readonly-view';
import { NewDMNView } from './views/dmn/new-dmn-view/new-dmn-view';
import { NewDiagramView } from './views/diagram/new-diagram-view/new-diagram-view';

export const routes: Routes = [
    {
        path: 'dmns/:id/:version/edit',
        component: DiagramEditorView
    },
    {
        path: 'dmns/:id/:version/view',
        component: DiagramReadonlyView
    },
    {
        path: 'dmns/:id/new',
        component: NewDiagramView
    },
    {
        path: 'dmns/:id/:version',
        component: DmnDetailView
    },
    {
        path: 'dmns/new',
        component: NewDMNView
    },
    {
        path: 'dmns',
        component: DmnListView
    },
    {
        path: '',
        component: IndexView
    },
    {
        path: '**',
        component: NotFoundView,
    },
];
