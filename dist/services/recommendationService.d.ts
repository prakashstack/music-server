export interface HomeSection {
    id: string;
    title: string;
    subtitle?: string;
    type: 'songs' | 'artists' | 'genres';
    items: any[];
}
export declare const recommendationService: {
    getPersonalizedSections(userId: string): Promise<HomeSection[]>;
    getGuestSections(): Promise<HomeSection[]>;
};
//# sourceMappingURL=recommendationService.d.ts.map