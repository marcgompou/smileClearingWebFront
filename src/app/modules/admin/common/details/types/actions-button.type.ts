export class ActionButtons {
    label: string;
    color: string;
    "endpoint": string;
    disabledKey?: string;
    disableValue?: any;
    icon?: string ='heroicons_outline:cog';
    confirmationTitle?: string='Voulez-vous effectuer cette action ?';
    actionType:'update'|'delete';
}

