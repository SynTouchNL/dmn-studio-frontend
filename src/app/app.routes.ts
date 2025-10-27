import { Routes } from '@angular/router';
import { canActivateAuthRole } from './guards/auth-guard/auth-guard';

// views
import { NotFoundView } from './views/etc/not-found-view/not-found-view';
import { IndexView } from './views/etc/index-view/index-view';
import { DmnListView } from './views/dmn/dmn-list-view/dmn-list-view';
import { DmnDetailView } from './views/dmn/dmn-detail-view/dmn-detail-view';
import { DiagramEditorView } from './views/diagram/diagram-editor-view/diagram-editor-view';
import { DiagramReadonlyView } from './views/diagram/diagram-readonly-view/diagram-readonly-view';
import { NewDMNView } from './views/dmn/new-dmn-view/new-dmn-view';
import { NewDiagramView } from './views/diagram/new-diagram-view/new-diagram-view';
import { UnauthorizedView } from './views/etc/unauthorized-view/unauthorized-view';
import { IndienenView } from './views/diagram/indienen-view/indienen-view';
import { DeploymentsListView } from './views/deployment/deployments-list-view/deployments-list-view';
import { DeploymentDetailsView } from './views/deployment/deployment-details-view/deployment-details-view';
import { NewDeploymentView } from './views/deployment/new-deployment-view/new-deployment-view';

export const routes: Routes = [
    // Deployment routes
    {
        path: 'deployments',
        component: DeploymentsListView,
        canActivate: [canActivateAuthRole],
        data: {
            role: 'editor'
        }
    },
    {
        path: 'deployments/new',
        component: NewDeploymentView,
        canActivate: [canActivateAuthRole],
        data: {
            role: 'editor'
        }
    },
    {
        path: 'deployments/:id',
        component: DeploymentDetailsView,
        canActivate: [canActivateAuthRole],
        data: {
            role: 'editor'
        }
    },

    // DMN routes
    {
        path: 'dmns/:id/:version/indienen',
        component: IndienenView,
        canActivate: [canActivateAuthRole],
        data: {
            role: 'editor'
        }
    },
    {
        path: 'dmns/:id/:version/edit',
        component: DiagramEditorView,
        canActivate: [canActivateAuthRole],
        data: {
            role: 'developer'
        }
    },
    {
        path: 'dmns/:id/:version/view',
        component: DiagramReadonlyView,
        canActivate: [canActivateAuthRole],
        data: {
            role: 'editor'
        }
    },
    {
        path: 'dmns/:id/new',
        component: NewDiagramView,
        canActivate: [canActivateAuthRole],
        data: {
            role: 'developer'
        }
    },
    {
        path: 'dmns/:id/:version',
        component: DmnDetailView,
        canActivate: [canActivateAuthRole],
        data: {
            role: 'editor'
        }
    },
    {
        path: 'dmns/new',
        component: NewDMNView,
        canActivate: [canActivateAuthRole],
        data: {
            role: 'developer'
        }
    },
    {
        path: 'dmns',
        component: DmnListView,
        canActivate: [canActivateAuthRole],
        data: {
            role: 'editor'
        }
    },

    // Auxilliary routes
    {
        path: '',
        component: IndexView,
        canActivate: [canActivateAuthRole],
        data: {
            role: 'editor'
        }
    },
    {
        path: 'not-authorized',
        component: UnauthorizedView,
    },
    {
        path: '**',
        component: NotFoundView,
        // data: { role: 'editor' }
    },
];
