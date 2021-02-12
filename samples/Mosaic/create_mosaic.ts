/**
 */
import consola from 'consola'
import {
  Account,
  MosaicDefinitionTransaction,
  MosaicFlags,
  MosaicId,
  MosaicNonce,
  UInt64,
} from 'symbol-sdk'

import { env } from '../util/env'
import { createDeadline } from '../util'
import { createAnnounceUtil, networkStaticPropsUtil, INetworkStaticProps } from '../util/announce'

async function main(props: INetworkStaticProps) {
  const initiatorAccount = Account.createFromPrivateKey(env.INITIATOR_KEY, props.networkType)
  const deadline = createDeadline(props.epochAdjustment)

  const nonce = MosaicNonce.createRandom()
  const isSupplyMutable = true
  const isTransferable = true
  const isRestrictable = true
  const divisibility = 0
  const duration = UInt64.fromUint(1000)

  const mosaicDefinitionTx = MosaicDefinitionTransaction.create(
    deadline(),
    nonce,
    MosaicId.createFromNonce(nonce, initiatorAccount.address),
    MosaicFlags.create(isSupplyMutable, isTransferable, isRestrictable),
    divisibility,
    duration,
    props.networkType,
  ).setMaxFee(props.minFeeMultiplier)

  const signedTx = initiatorAccount.sign(mosaicDefinitionTx, props.generationHash)

  consola.info('announce: %s, signer: %s',
    signedTx.hash,
    signedTx.getSignerAddress().plain(),
  )
  consola.info('%s/transactionStatus/%s', props.url, signedTx.hash)
  const announceUtil = createAnnounceUtil(props.factory)
  announceUtil(signedTx)
    .subscribe(
      resp => {
        consola.info('confirmed: %s, height: %d',
          resp.transactionInfo?.hash,
          resp.transactionInfo?.height.compact(),
        )
        consola.info('%s/transactions/confirmed/%s', props.url, signedTx.hash)
      },
      resp => {
        consola.info(resp)
        // consola.info('error: %s, address: %s, ',
        //   resp.address.plain(),
        //   resp.code
        // )
      }
    )
}

networkStaticPropsUtil(env.GATEWAY_URL).toPromise()
  .then(props => main(props))
