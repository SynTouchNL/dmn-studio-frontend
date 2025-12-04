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
import { DiagramCreateView } from './views/diagram/diagram-create-view/diagram-create-view';
import { UnauthorizedView } from './views/etc/unauthorized-view/unauthorized-view';
import { DiagramSubmitView } from './views/diagram/diagram-submit-view/diagram-submit-view';
import { DeploymentsListView } from './views/deployment/deployments-list-view/deployments-list-view';
import { DeploymentDetailsView } from './views/deployment/deployment-details-view/deployment-details-view';
import { DeploymentCreateView } from './views/deployment/deployment-create-view/deployment-create-view';
import { UnittestListView } from './views/testing/unittest-list-view/unittest-list-view';
import {UnittestDetailView} from './views/testing/unittest-detail-view/unittest-detail-view';
import {UnittestCreateView} from './views/testing/unittest-create-view/unittest-create-view';
import {DmnReviewView} from './views/dmn/dmn-review-view/dmn-review-view';

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
        component: DeploymentCreateView,
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
        path: 'dmns/:id/:version/test',
        component: UnittestListView,
        canActivate: [canActivateAuthRole],
        data: {
            role: 'developer'
        }
    },
    {
        path: 'dmns/:id/:version/test/view',
        component: UnittestDetailView,
        canActivate: [canActivateAuthRole],
        data: {
            role: 'developer'
        }
    },
    {
        path: 'dmns/:id/:version/test/create',
        component: UnittestCreateView,
        canActivate: [canActivateAuthRole],
        data: {
            role: 'developer'
        }
    },
    {
        path: 'dmns/:id/:version/indienen',
        component: DiagramSubmitView,
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
        path: 'dmns/:id/:version/review',
        component: DmnReviewView,
        canActivate: [canActivateAuthRole],
        data: {
            role: 'editor'
        }
    },
    {
        path: 'dmns/:id/new',
        component: DiagramCreateView,
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
    },
];
