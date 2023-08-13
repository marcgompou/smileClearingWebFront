export interface Clients
{
    id: string;
    avatar?: string | null;
    background?: string | null;
    nom: string;
    emails?: {
        email: string;
        label: string;
    }[];

    phoneNumbers?: {
        country: string;
        phoneNumber: string;
        label: string;
    }[];
    title?: string;
    company?: string;
    birthday?: string | null;
    address?: string | null;
    notes?: string | null;
    tags: string[];
}

