export interface WorldState {
    world_info: {
        name: string;
        description: string;
    };
    player_characters: Record<string, PlayerCharacter>;
}
export interface PlayerCharacter {
    name: string;
    class: string;
    hp: number;
}
