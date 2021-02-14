/**
 * $ ts-node transfer/create_mosaic_transfer.ts RECIPIENT_ADDRESS 1
 */
import consola from "consola"
import {
  Account,
  AggregateTransaction,
  EmptyMessage,
  HashLockTransaction,
  PlainMessage,
  TransferTransaction,
  UInt64,
} from "symbol-sdk"

import { env } from '../util/env'
import { printTx } from '../util/print'
import { createAnnounceUtil, networkStaticPropsUtil, INetworkStaticProps } from '../util/announce'
import { createDeadline } from '../util'
import { EmptyError } from "rxjs"

async function main(props: INetworkStaticProps) {
  const deadline = createDeadline(props.epochAdjustment)

  const initiatorAccount = Account.createFromPrivateKey(env.INITIATOR_KEY, props.networkType)
  const aliceAccount = Account.createFromPrivateKey(env.ALICE_KEY, props.networkType)

  // 送信するモザイクオブジェクトを作る
  const xymMosaic = props.currency.createRelative(1)

  // 送信するモザイク配列
  const mosaics = [ xymMosaic ]

  // メッセージオブジェクトを作成
  const message = PlainMessage.create("Hi, Alice. Pay my money back!")

  const fromCreditor = TransferTransaction.create(
    deadline(),
    aliceAccount.address,
    [],
    message,
    props.networkType
  ).setMaxFee(props.minFeeMultiplier)

  const fromDebtor = TransferTransaction.create(
    deadline(),
    initiatorAccount.address,
    mosaics,
    EmptyMessage,
    props.networkType
  ).setMaxFee(props.minFeeMultiplier)

  const aggregateTx = AggregateTransaction.createBonded(
    deadline(),
    [ fromCreditor.toAggregate(initiatorAccount.publicAccount),
      fromDebtor.toAggregate(aliceAccount.publicAccount) ],
    props.networkType
  ).setMaxFeeForAggregate(props.minFeeMultiplier, 1)

  const signedTx = initiatorAccount.sign(aggregateTx, props.generationHash)

  consola.info('announce: %s, signer: %s, maxFee: %d',
    signedTx.hash,
    signedTx.getSignerAddress().plain(),
    aggregateTx.maxFee
  )
  consola.info('%s/transactionStatus/%s', props.url, signedTx.hash)

  const hashLockTx = HashLockTransaction.create(
    deadline(),
    props.currency.createRelative(10),
    UInt64.fromUint(5000),
    signedTx,
    props.networkType
  ).setMaxFee(props.minFeeMultiplier)

  const signedHLTx = initiatorAccount.sign(hashLockTx, props.generationHash)
  consola.info('announce: %s, signer: %s, maxFee: %d',
    signedHLTx.hash,
    signedHLTx.getSignerAddress().plain(),
    hashLockTx.maxFee
  )
  consola.info('%s/transactionStatus/%s', props.url, signedHLTx.hash)

  const announceUtil = createAnnounceUtil(props.factory)
  announceUtil(signedTx, signedHLTx)
    .subscribe(
      resp => {
        printTx(resp)
        consola.success('%s/transactions/confirmed/%s', props.url, signedTx.hash)
      },
      error => {
        consola.error(error)
      }
    )
}

networkStaticPropsUtil(env.GATEWAY_URL).toPromise()
  .then(props => main(props))