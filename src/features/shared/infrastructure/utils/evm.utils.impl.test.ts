import { DOMAIN_SEPARATORS, SEPOLIA_ID } from '../../../../core';
import { CreateBidDto } from '../../../bids';
import { CreateListingDto } from '../../../listings';
import { CreateSettlementDto } from '../../../settlements';
import { EvmUtilsImpl } from './evm.utils.impl';

const VALID_LISTING = {
	owner: '0x3897326cEda92B3da2c27a224D6fDCFefCaCf57A',
	chainId: '11155111',
	minPriceCents: '150000',
	nftContract: '0xf44b599a0aB6b8cb14E992994BEC0dc59dF883B2',
	tokenId: '1',
	nonce: '0',
	signature: {
		v: 28,
		r: '0x5ef4620f4b296763ff15209456d75e868f149a8d1c6821f1ff11fab70bca0ee0',
		s: '0x337ddcb26ea919a2bf5ad6e1d49bd6951a27d1d2e940a5543a70eabc5dbe237e'
	}
};

const VALID_BID = {
	bidder: '0xE98D94496aB9084f597a69978b593EBf83147335',
	listing: VALID_LISTING,
	tokenAddress: '0xc29f6F8D639eF187DcFEfeFBaD989cF2C941a23A',
	validUntil: '1735504160',
	value: '250',
	signature: {
		v: 28,
		r: '0x1469ac6f9636c24d2d8c3fb2cbef73708876e15f23f23b1d33863939c905a21c',
		s: '0x7d9a7ea039465c928311bcb737b23153232028038beadba2a667aa720f17602b'
	}
};

const VALID_SETTLEMENT = {
	bid: {
		bidder: '0xE98D94496aB9084f597a69978b593EBf83147335',
		listing: {
			owner: '0x3897326cEda92B3da2c27a224D6fDCFefCaCf57A',
			chainId: '11155111',
			minPriceCents: '150000',
			nftContract: '0xf44b599a0aB6b8cb14E992994BEC0dc59dF883B2',
			tokenId: '1',
			nonce: '0',
			signature: {
				v: 28,
				r: '0x5ef4620f4b296763ff15209456d75e868f149a8d1c6821f1ff11fab70bca0ee0',
				s: '0x337ddcb26ea919a2bf5ad6e1d49bd6951a27d1d2e940a5543a70eabc5dbe237e'
			}
		},
		tokenAddress: '0xc29f6F8D639eF187DcFEfeFBaD989cF2C941a23A',
		validUntil: '1735504160',
		value: '250',
		signature: {
			v: 28,
			r: '0x1469ac6f9636c24d2d8c3fb2cbef73708876e15f23f23b1d33863939c905a21c',
			s: '0x7d9a7ea039465c928311bcb737b23153232028038beadba2a667aa720f17602b'
		}
	},
	signature: {
		v: 27,
		r: '0xc21f88f00f01849ecbe4bcb75bd8f6cc2ac1f3507498e385b78df7db5f5ae334',
		s: '0x6adc46861e9888247b6b4f55cd7eb73449d835c94a0c3fd5e2df1b8cb6f77c4c'
	}
};

describe('tests in evm.utils.impl.ts', () => {
	let evmUtilsImpl: EvmUtilsImpl;
	beforeAll(() => {
		evmUtilsImpl = new EvmUtilsImpl(DOMAIN_SEPARATORS[SEPOLIA_ID]);
	});
	test('should validate correct listing signature', async () => {
		const signedListingDto = CreateListingDto.create(VALID_LISTING);
		expect(evmUtilsImpl.isListingSignatureCorrect(signedListingDto)).toBeTruthy();
	});
	test('should invalidate incorrect listing signature', async () => {
		const signedListingDto = CreateListingDto.create({
			...VALID_LISTING,
			signature: VALID_BID.signature
		});
		expect(evmUtilsImpl.isListingSignatureCorrect(signedListingDto)).toBeFalsy();
	});
	test('should validate correct bid signature', async () => {
		const signedBidDto = CreateBidDto.create(VALID_BID);
		expect(evmUtilsImpl.isBidSignatureCorrect(signedBidDto)).toBeTruthy();
	});
	test('should invalidate incorrect bid signature', async () => {
		const signedBidDto = CreateBidDto.create({
			...VALID_BID,
			signature: VALID_LISTING.signature
		});
		expect(evmUtilsImpl.isBidSignatureCorrect(signedBidDto)).toBeFalsy();
	});
	test('should validate correct settlement signature', async () => {
		const signedSettlementDto = CreateSettlementDto.create(VALID_SETTLEMENT);
		expect(evmUtilsImpl.isSettlementSignatureCorrect(signedSettlementDto)).toBeTruthy();
	});
	test('should invalidate incorrect settlement signature', async () => {
		const signedSettlementDto = CreateSettlementDto.create({
			...VALID_SETTLEMENT,
			signature: VALID_LISTING.signature
		});
		expect(evmUtilsImpl.isSettlementSignatureCorrect(signedSettlementDto)).toBeFalsy();
	});
});
