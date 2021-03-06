# ネームスペース

ネームスペースとはインターネットのドメインネームと同じような名前の定義です。
`foo.bar.baz`のように3階層まで定義することができます。

- [ネームスペース — NEM Developer Center](https://nemtech.github.io/ja/concepts/namespace.html)


## ネームスペースの用途

ネームスペースは各レベルごとにアカウントのエイリアスまたはモザイクのエイリアス(別名)として割り当てることができます。

- `hoge`というネームスペースとあるアカウントに紐付けると、ネームスペースからアドレスを取得できるようになる。
- `huga`というネームスペースとあるモザイクに紐付けると、ネームスペースからモザイクを取得できるようになる。
- ネームスペースの保有アカウントを特定することができる。

また、ネームスペースのレベルごとに異なる紐づけも可能です。

例えば`foo`をアカウントAへ、`foo.bar`をアカウントBへ、`foo.bar.baz`をモザイクに紐付けるということもできます。

基軸モザイクである`cat.currency`もモザイクに`cat.currency`というネームスペースが割当てられています。

エイリアスとして利用するには、後述しているエイリアスリンクトランザクションを使います。

基軸モザイクである`cat.currency`もモザイクに`cat.currency`というネームスペースが割当てられています。

ネームスペースとして利用可能な文字には制限があります。

- a から z のアルファベット小文字
- 0 から 9 の数字
- ‘ (アポストロフィ)
- _ (アンダースコア)
- \- (ハイフン)

.(ドット)で区切ることで3階層までのネームスペースを定義することができ、それぞれサブネームスペースと呼ばれます。

具体的には`japan.tokyo.shinjuku`のようなネームスペースを取得できます。

`japan.tokyo.shinjuku`の場合は、`japan`がルート、`tokyo`は`jappn`のサブ、`shinjuku`は`japan.tokyo`のサブとなります。

サブネームスペースを定義するには先に親のネームスペース(`japan`もしくは`japan.tokyo`)が定義されている必要があります。

ネームスペースにはレンタル期間（ブロック数）があり、ルートネームスペースに適用されます。

そのためサブネームスペースの有効期間はルートネームスペースのレンタル期間と同じになります。


## ネームスペースの取得

`namespace/register_namespace.js`を実行してください。

このスクリプトは第一引数に取得したいネームスペース名を渡します。

第二引数でレンタル期間を指定できます。(ない場合は100ブロック)

なお、レンタル期間`1 block`につき`1 cat.currency`が必要です。

```shell
$ node namespace/register_namespace.js test123
initiator: SAFPLK-SQJTYG-TWKNJ6-B66LJV-3VRBMU-SBQH7Y-6ZH4
Endpoint:  http://localhost:3000/account/SAFPLKSQJTYGTWKNJ6B66LJV3VRBMUSBQH7Y6ZH4
Namespace: test123 (ff87cc82daab0bbf)
Blocks:    100
Endpoint:  http://localhost:3000/namespace/ff87cc82daab0bbf

connection open
[Transaction announced]
Endpoint: http://localhost:3000/transaction/00138FF331E8BC4AF2A802A640F4372BF4256C032DE5FC2278F404A8F79A0171
Hash:     00138FF331E8BC4AF2A802A640F4372BF4256C032DE5FC2278F404A8F79A0171
Signer:   A29FE98485D2841C7C68A2B521156EE5D0170FF6AFF2ED3BF4E908500EC083B0

[UNCONFIRMED] SAFPLK...
{"transaction":{"type":16718,"networkType":144,"version":36865,"maxFee":[0,0],"deadline":[4059661428,23],"signature":"5C17F03A2E6E2F64F2FF7A64D717B75E234A48ADFDE14911FDB91A3416C96A7E4B6D06AA548CBD5E6DF20C668F256FFB8F780899E2CAEE65FC5B5DF0E8FBF603","signer":"A29FE98485D2841C7C68A2B521156EE5D0170FF6AFF2ED3BF4E908500EC083B0","namespaceType":0,"namespaceName":"test123","namespaceId":{"id":[3668642751,4287089794],"fullName":""},"duration":[100,0]}}

[CONFIRMED] SAFPLK...
{"transaction":{"type":16718,"networkType":144,"version":36865,"maxFee":[0,0],"deadline":[4059661428,23],"signature":"5C17F03A2E6E2F64F2FF7A64D717B75E234A48ADFDE14911FDB91A3416C96A7E4B6D06AA548CBD5E6DF20C668F256FFB8F780899E2CAEE65FC5B5DF0E8FBF603","signer":"A29FE98485D2841C7C68A2B521156EE5D0170FF6AFF2ED3BF4E908500EC083B0","namespaceType":0,"namespaceName":"test123","namespaceId":{"id":[3668642751,4287089794],"fullName":""},"duration":[100,0]}}
```

承認されたらコンソールに表示されたURLで確認してみましょう。

- http://localhost:3000/namespace/ff87cc82daab0bbf

APIのレスポンスだとすこし見にくいと思うので`nem2-cli`でも確認してみましょう。

```shell
$ nem2-cli namespace info -n test123 --profile alice
Namespace: test123
------------------

hexadecimal:    ff87cc82daab0bbf
uint:           [ 3668642751, 4287089794 ]
type:           Root namespace
owner:          SAFPLK-SQJTYG-TWKNJ6-B66LJV-3VRBMU-SBQH7Y-6ZH4
startHeight:    593
endHeight:      693
```

今回作ったのはルートネームスペースなので`type`が`Root namespace`と表示されています。

他にもレンタル開始ブロックと終了ブロックなども表示されます。

なお`namespace info`コマンドはネームスペース名の情報を取得するコマンドです。

自分(プロファイル)の保有するネームスペースを取得したい場合は`namespace owned`コマンドを利用できます。

```shell
$ nem2-cli namespace owned --profile alice
Namespace: test123
------------------

hexadecimal:    ff87cc82daab0bbf
uint:           [ 3668642751, 4287089794 ]
type:           Root namespace
owner:          SAFPLK-SQJTYG-TWKNJ6-B66LJV-3VRBMU-SBQH7Y-6ZH4
startHeight:    593
endHeight:      693
```


### コード解説

```javascript
const [parent, child] = namespace.split(/\.(?=[^\.]+$)/)

let registerTx
if (child) {
  registerTx = RegisterNamespaceTransaction.createSubNamespace(
    Deadline.create(),
    child,
    parent,
    NetworkType.MIJIN_TEST
  )
} else {
  registerTx = RegisterNamespaceTransaction.createRootNamespace(
    Deadline.create(),
    parent,
    UInt64.fromUint(blocks),
    NetworkType.MIJIN_TEST
  )
}
```

ルートまたはサブの定義に使うオブジェクトはそれぞれ異なるので、その場合分けを行います。

それ以降はこのオブジェクトに署名して発信するだけです。

サブネームスペースを作りたい場合は`test123.sub123`のような引数を渡してください。

この際、先にルートネームスペースが承認済みである必要があります。

なお、サブネームスペースの取得には1つごとに`1 cat.currency`が必要です。


## ネームスペースをアグリゲートトランザクションで取得

前述のように、サブネームスペースを取得する場合は一度ルートネームスペースを取得し、承認されたあとにサブネームスペースを指定しなければなりません。

この順序を変えることはできませんが、これらのトランザクションをアグリゲートトランザクションで1つのトランザクションにすることができます。

`namespace/register_namespace_atomically.js`を実行してください。

このスクリプトは第一引数にドットで区切ったサブネームスペースを含めたネームスペース名を渡します。

第二引数でレンタル期間を指定できます。(ない場合は100ブロック)

```shell
$ node namespace/register_namespace_atomically.js aaa.bbb.ccc
initiator: SAFPLK-SQJTYG-TWKNJ6-B66LJV-3VRBMU-SBQH7Y-6ZH4
Endpoint:  http://localhost:3000/account/SAFPLKSQJTYGTWKNJ6B66LJV3VRBMUSBQH7Y6ZH4
Blocks:    100
Namespace: aaa (acccbcfcb5ecee23)
Endpoint:  http://localhost:3000/namespace/acccbcfcb5ecee23
Namespace: aaa.bbb (9e75f2396f24994e)
Endpoint:  http://localhost:3000/namespace/9e75f2396f24994e
Namespace: aaa.bbb.ccc (bfd5304c9be87a5c)
Endpoint:  http://localhost:3000/namespace/bfd5304c9be87a5c

connection open
[Transaction announced]
Endpoint: http://localhost:3000/transaction/4DB3A8A471822CFBE05A6EE92AF687CF1E680D0DF53A72366D698B8F42AA3B3E
Hash:     4DB3A8A471822CFBE05A6EE92AF687CF1E680D0DF53A72366D698B8F42AA3B3E
Signer:   A29FE98485D2841C7C68A2B521156EE5D0170FF6AFF2ED3BF4E908500EC083B0

[UNCONFIRMED] SAFPLK...
{"transaction":{"type":16705,"networkType":144,"version":36865,"maxFee":[0,0],"deadline":[4061002806,23],"signature":"459BEF194E5747A73A6390016A2AF392B1B0EEA8D17EDA9B623DE9FE11871ED9F03B1D6543A3131639FD422DB9C1C55905C43C24969910370E02BF394F3AB70E","signer":"A29FE98485D2841C7C68A2B521156EE5D0170FF6AFF2ED3BF4E908500EC083B0","transactions":[{"transaction":{"type":16718,"networkType":144,"version":36865,"maxFee":[0,0],"deadline":[4061002806,23],"signature":"459BEF194E5747A73A6390016A2AF392B1B0EEA8D17EDA9B623DE9FE11871ED9F03B1D6543A3131639FD422DB9C1C55905C43C24969910370E02BF394F3AB70E","signer":"A29FE98485D2841C7C68A2B521156EE5D0170FF6AFF2ED3BF4E908500EC083B0","namespaceType":0,"namespaceName":"aaa","namespaceId":{"id":[3052203555,2899098876],"fullName":""},"duration":[100,0]}},{"transaction":{"type":16718,"networkType":144,"version":36865,"maxFee":[0,0],"deadline":[4061002806,23],"signature":"459BEF194E5747A73A6390016A2AF392B1B0EEA8D17EDA9B623DE9FE11871ED9F03B1D6543A3131639FD422DB9C1C55905C43C24969910370E02BF394F3AB70E","signer":"A29FE98485D2841C7C68A2B521156EE5D0170FF6AFF2ED3BF4E908500EC083B0","namespaceType":1,"namespaceName":"bbb","namespaceId":{"id":[1864669518,2658529849],"fullName":""},"parentId":{"id":[3052203555,2899098876],"fullName":""}}},{"transaction":{"type":16718,"networkType":144,"version":36865,"maxFee":[0,0],"deadline":[4061002806,23],"signature":"459BEF194E5747A73A6390016A2AF392B1B0EEA8D17EDA9B623DE9FE11871ED9F03B1D6543A3131639FD422DB9C1C55905C43C24969910370E02BF394F3AB70E","signer":"A29FE98485D2841C7C68A2B521156EE5D0170FF6AFF2ED3BF4E908500EC083B0","namespaceType":1,"namespaceName":"ccc","namespaceId":{"id":[2615704156,3218419788],"fullName":""},"parentId":{"id":[1864669518,2658529849],"fullName":""}}}],"cosignatures":[]}}

[CONFIRMED] SAFPLK...
{"transaction":{"type":16705,"networkType":144,"version":36865,"maxFee":[0,0],"deadline":[4061002806,23],"signature":"459BEF194E5747A73A6390016A2AF392B1B0EEA8D17EDA9B623DE9FE11871ED9F03B1D6543A3131639FD422DB9C1C55905C43C24969910370E02BF394F3AB70E","signer":"A29FE98485D2841C7C68A2B521156EE5D0170FF6AFF2ED3BF4E908500EC083B0","transactions":[{"transaction":{"type":16718,"networkType":144,"version":36865,"maxFee":[0,0],"deadline":[4061002806,23],"signature":"459BEF194E5747A73A6390016A2AF392B1B0EEA8D17EDA9B623DE9FE11871ED9F03B1D6543A3131639FD422DB9C1C55905C43C24969910370E02BF394F3AB70E","signer":"A29FE98485D2841C7C68A2B521156EE5D0170FF6AFF2ED3BF4E908500EC083B0","namespaceType":0,"namespaceName":"aaa","namespaceId":{"id":[3052203555,2899098876],"fullName":""},"duration":[100,0]}},{"transaction":{"type":16718,"networkType":144,"version":36865,"maxFee":[0,0],"deadline":[4061002806,23],"signature":"459BEF194E5747A73A6390016A2AF392B1B0EEA8D17EDA9B623DE9FE11871ED9F03B1D6543A3131639FD422DB9C1C55905C43C24969910370E02BF394F3AB70E","signer":"A29FE98485D2841C7C68A2B521156EE5D0170FF6AFF2ED3BF4E908500EC083B0","namespaceType":1,"namespaceName":"bbb","namespaceId":{"id":[1864669518,2658529849],"fullName":""},"parentId":{"id":[3052203555,2899098876],"fullName":""}}},{"transaction":{"type":16718,"networkType":144,"version":36865,"maxFee":[0,0],"deadline":[4061002806,23],"signature":"459BEF194E5747A73A6390016A2AF392B1B0EEA8D17EDA9B623DE9FE11871ED9F03B1D6543A3131639FD422DB9C1C55905C43C24969910370E02BF394F3AB70E","signer":"A29FE98485D2841C7C68A2B521156EE5D0170FF6AFF2ED3BF4E908500EC083B0","namespaceType":1,"namespaceName":"ccc","namespaceId":{"id":[2615704156,3218419788],"fullName":""},"parentId":{"id":[1864669518,2658529849],"fullName":""}}}],"cosignatures":[]}}
```

トランザクションが承認されたらURLまたは`nem2-cli`で確認してみてください。

```shell
$ nem2-cli namespace info -n aaa.bbb.ccc --profile alice
Namespace: aaa.bbb.ccc
----------------------

hexadecimal:    bfd5304c9be87a5c
uint:           [ 2615704156, 3218419788 ]
type:           Sub namespace
owner:          SAFPLK-SQJTYG-TWKNJ6-B66LJV-3VRBMU-SBQH7Y-6ZH4
startHeight:    628
endHeight:      728

Parent Id: aaa.bbb.ccc
----------------------

hexadecimal:    9e75f2396f24994e
uint:           [ 1864669518, 2658529849 ]
```


### コード解説

```javascript
// 各レベルの登録トランザクションを生成
const txes = parts.reduce((accum, part, idx, array) => {
  const parent = array.slice(0, idx).join('.');
  let registerTx;
  if (accum.length === 0) {
    registerTx = RegisterNamespaceTransaction.createRootNamespace(
      Deadline.create(),
      part,
      UInt64.fromUint(blocks),
      NetworkType.MIJIN_TEST
    );
  } else {
    registerTx = RegisterNamespaceTransaction.createSubNamespace(
      Deadline.create(),
      part,
      parent,
      NetworkType.MIJIN_TEST
    );
  }
  accum.push(registerTx);
  return accum;
}, []);

// アグリゲートコンプリートトランザクション組み立て
// トランザクションは配列先頭から処理されるので辻褄が合うように順序には気をつける
const aggregateTx = AggregateTransaction.createComplete(
  Deadline.create(),
  txes.map(tx => tx.toAggregate(initiater.publicAccount)),
  // 子から作ろうとするとエラーになる
  // txes.map(tx => tx.toAggregate(initiater.publicAccount)).reverse(),
  NetworkType.MIJIN_TEST,
  []
);
```

ネームスペースの定義ごとの`RegisterNamespaceTransaction`オブジェクトを作成します。

各トランザクションをアグリゲート化し、アグリゲートトランザクションでまとめたら、署名をして配信します。
