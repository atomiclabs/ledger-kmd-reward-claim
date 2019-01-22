# Ledger KMD Reward Claim

> Claim your KMD rewards on your Ledger device - [atomiclabs.github.io/ledger-kmd-reward-claim/](https://atomiclabs.github.io/ledger-kmd-reward-claim/)

![](/screenshot.png)

## Usage

- Make sure the KMD app and firmware on your Ledger are up to date.
- Connect your Ledger.
- Open the KMD app on your Ledger.
- Open the Ledger KMD Reward Claim app on your computer.
- Click the "Check Rewards" button.

## FAQ

### Why do I have to pay a 5% fee?

Before we created this app there was no way to claim KMD rewards on a Ledger hardware wallet. Community members have been repeatedly requesting this functionality but no solution was available. We tried to raise funding for this but were unsuccessful.

As a solution we decided to build the functionality for free and take a small fee as payment. The fees will be used to fund future maintenance and further development in the Komodo ecosystem.

The fee is 5% **of the reward** being claimed. As an example, if you have 100 KMD and you are claiming 5 KMD in rewards, we will take 0.25 KMD (5% of the 5 KMD being claimed) as our fee. You will be credited with 4.75 KMD.

If you think the fee is too high (or too low), then [please let us know](https://github.com/atomiclabs/ledger-kmd-reward-claim/issues/2).

The code is licensed under MIT to be the most beneficial to the community. This means you are not legally prevented from copying the code and removing the fee. If you decide to modify our code to remove the fee or use an alternate version with our fee removed, we will not be able to sustain development on this project or others within the Komodo ecosystem. If you like the work we are doing, please pay the fee to support future development.

### I get an error signing or broadcasting my claim transaction, what went wrong?

This is most likely because you are using an outdated version of the KMD app on your Ledger which doesn't support the overwinter hardfork.

Make sure the KMD app and firmware on your Ledger are up to date before trying to claim your rewards.

If you are sure your device is up to date then please [open an issue](https://github.com/atomiclabs/ledger-kmd-reward-claim/issues/new) with as much information as possible and we'll try and help.

### Why do all my funds get sent back to a new address?

We follow the same BIP44 standard that Ledger Live follows. We will send your reward claim to the next unused address in your account. This means all UTXOs in a single account are consolidated in a single transaction, which does have some privacy implications. However, in the Komodo ecosystem, most wallets just have a single address which is re-used, this is even worse for privacy. If you want privacy you should use a shielded address. Therefor, and after consulting with Komodo lead developer @jl777, we don't see this to be an issue.

To clarify, to preserve privacy across accounts, UTXOs in different accounts will **never** be mixed together, this is why you need to claim your rewards in each account separately. For increased anonymity, you should claim each account on different days to avoid time analysis linking the separate claims.

If consolidating the UTXOs is an issue for you and you'd like a solution that doesn't link addresses together, then [please let us know](https://github.com/atomiclabs/ledger-kmd-reward-claim/issues/3).

### The app is saying my browser is unsupported, can you support it?

We don't blacklist any specific browsers, we detect compatibility for the U2F API which is required to communicate with the Ledger. If the browser doesn't support the U2F API then we show an "Unsupported Browser" dialog.

You can view a list of U2F supporting browsers at [caniuse.com/#feat=u2f](https://caniuse.com/#feat=u2f).

## License

MIT © Atomic Labs<br />
MIT © Luke Childs
