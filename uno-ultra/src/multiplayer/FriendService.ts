export interface Friend {
  code: string;
  name: string;
  online: boolean;
}

export class FriendService {
  private friends = new Map<string, Friend>();

  add(friend: Friend): void {
    this.friends.set(friend.code, friend);
  }

  list(): Friend[] {
    return [...this.friends.values()];
  }
}
