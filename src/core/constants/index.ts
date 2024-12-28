/* eslint-disable @typescript-eslint/no-magic-numbers */

export const SIXTY = 60 as const;
export const ONE_HUNDRED = 100 as const;
export const ONE_THOUSAND = 1000 as const;

export const ZERO = 0 as const;
export const ONE = 1 as const;
export const TEN = 10 as const;

export const ADDRESS_REGEX = new RegExp(/^(0x)?[0-9a-fA-F]{40}$/);
export const BYTES32_REGEX = new RegExp(/^(0x)?[0-9a-fA-F]{64}$/);


export const ETH_MAINNET_ID = "1";
export const POLYGON_ID = "137";
export const SEPOLIA_ID = "11155111";

export const DOMAIN_SEPARATOR_POLYGON = "0x18fe943f718ca9eea10beb465fad697a409bfdab62830c6218e6333db82a854b";
export const DOMAIN_SEPARATOR_SEPOLIA = "0xc011709dbbb9deb3fc6044957fcef85f12c9b999edaa5c6c26250edf4788ecda";

export const DOMAIN_SEPARATORS = {
	[POLYGON_ID]: DOMAIN_SEPARATOR_POLYGON,
	[SEPOLIA_ID]: DOMAIN_SEPARATOR_SEPOLIA
} as Record<string, string>;

export const EIP712_LISTING_TYPES = {
    Listing: [{
        name: "nftContract",
        type: "address"
      },
      {
        name: "tokenId",
        type: "uint256"
      },
      {
        name: "minPriceCents",
        type: "uint256"
      },
      {
        name: "nonce",
        type: "uint256"
      },
    ]
};

export const ERC721_ABI = [
	"function ownerOf(uint256) external view returns (address)"
];

export const ERC20_ABI = [
	"function balanceOf(address) external view returns (uint256)"
];

export enum HttpCode {
	OK = 200,
	CREATED = 201,
	NO_CONTENT = 204,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	INTERNAL_SERVER_ERROR = 500
}
