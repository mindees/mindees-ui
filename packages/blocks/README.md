<p align="center">
  <a href="https://mindees-ui.vercel.app">
    <img src="https://raw.githubusercontent.com/mindees/mindees-ui/main/mindees-logo.png" alt="MindeesUI — ready-made React Native and Expo screen blocks and templates" width="120" height="120" />
  </a>
</p>

<h1 align="center">@mindees/blocks</h1>

<p align="center">
  <b>Ready-made React Native + Expo screen blocks &amp; templates</b> — login forms, checkout flows, dashboards, chat UI, pricing screens, and more.<br/>
  74 accessible blocks composed from <a href="https://www.npmjs.com/package/@mindees/ui">@mindees/ui</a> primitives. Drop one in, wire your callbacks, restyle with tokens, ship.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@mindees/blocks"><img src="https://img.shields.io/npm/v/@mindees/blocks?label=%40mindees%2Fblocks&logo=npm&color=cb3837" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@mindees/blocks"><img src="https://img.shields.io/npm/dm/@mindees/blocks?label=downloads&logo=npm" alt="downloads" /></a>
  <a href="https://bundlephobia.com/package/@mindees/blocks"><img src="https://img.shields.io/bundlephobia/minzip/@mindees/blocks?label=size" alt="bundle size" /></a>
  <a href="https://github.com/mindees/mindees-ui/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT license" /></a>
</p>

<p align="center">
  <a href="https://mindees-ui.vercel.app"><b>Documentation</b></a> ·
  <a href="https://mindees-ui.vercel.app/docs/blocks"><b>Blocks</b></a> ·
  <a href="https://github.com/mindees/mindees-ui"><b>GitHub</b></a> ·
  <a href="https://www.npmjs.com/package/@mindees/ui"><b>@mindees/ui</b></a>
</p>

---

## What is @mindees/blocks?

`@mindees/blocks` is a library of **74 ready-made React Native screen blocks and templates** for **Expo** and bare React Native CLI apps. Each block is a styled, accessible composition of [`@mindees/ui`](https://www.npmjs.com/package/@mindees/ui) primitives — a **login form**, a **signup form**, a **checkout form**, a **product card**, a **dashboard** layout, a **chat UI**, a **pricing screen**, an **onboarding** flow, and dozens more.

Blocks are **pure UI**: all data and actions flow through props and callbacks. There is no network code, no auth backend, no storage, and no navigation library baked in — so a block drops into _your_ stack without fighting it. Restyle everything at once by swapping theme tokens via `@mindees/ui`'s `ThemeProvider` and `createThemes`.

Think of it as **shadcn/ui for React Native**: copy-paste-quality building blocks, only installed as a tree-shakeable package and typed end to end.

## Features

- 🧩 **74 ready-made blocks** — auth, commerce, account/profile, social/messaging, dashboard/admin, web, and full screens.
- 📱 **Universal React Native + Expo + React Native Web** — one codebase ships to iOS, Android, and the web.
- 🎛️ **Pure UI, callback-driven** — `onSubmit`, `onChange`, `value` props; no network, no storage, no lock-in.
- 🎨 **Token-themed** — restyle every block at once with `@mindees/ui` tokens, light/dark/high-contrast themes, and one-line `createThemes`.
- ♿ **Accessibility-first** — built on WCAG 2.2 AA primitives, with labels, roles, and live-region announcements wired in.
- 🧠 **TypeScript strict** — every block ships fully typed props; zero `any` in the public API.
- 🪶 **Tree-shakeable** — `sideEffects: false`, named exports, so you only bundle the blocks you import.

## Install

```sh
pnpm add @mindees/blocks @mindees/ui @mindees/tokens @mindees/icons

# @mindees/ui's New-Architecture peers
pnpm add react-native-reanimated react-native-gesture-handler react-native-unistyles \
  react-native-nitro-modules react-native-edge-to-edge react-native-safe-area-context \
  react-native-svg @shopify/flash-list
```

`npm` and `yarn` work too. `@mindees/blocks` depends on `@mindees/ui`, `@mindees/tokens`, and `@mindees/icons`, so make sure those (and `@mindees/ui`'s peers) are installed and your app is wrapped in `<ThemeProvider>` / `<PortalProvider>`.

## Quickstart

Every block takes your data through props and reports back through callbacks. Here is a complete login screen:

```tsx
import { ScreenWrapper, Stack, Heading } from '@mindees/ui';
import { LoginForm, SocialLoginButtons } from '@mindees/blocks';

export function LoginScreen() {
  return (
    <ScreenWrapper padding="lg" scroll avoidKeyboard>
      <Stack gap="lg">
        <Heading level={1}>Welcome back</Heading>
        <LoginForm
          onSubmit={({ email, password }) => signIn(email, password)}
          onForgotPassword={() => router.push('/forgot-password')}
          footer={
            <SocialLoginButtons
              providers={[
                { key: 'google', label: 'Continue with Google', onPress: () => oauth('google') },
                { key: 'apple', label: 'Continue with Apple', onPress: () => oauth('apple') },
              ]}
            />
          }
        />
      </Stack>
    </ScreenWrapper>
  );
}
```

Swap the brand color and every block restyles — no per-component edits:

```tsx
import { ThemeProvider, createThemes } from '@mindees/ui';

const { light, dark } = createThemes({
  name: 'acme',
  light: { brand: '#6d28d9' },
  dark: { brand: '#a78bfa' },
});

<ThemeProvider light={light} dark={dark}>
  {/* every block re-themes automatically */}
</ThemeProvider>;
```

## What's in the box (74 blocks)

| Category               | Blocks                                                                                                                                                                                                                                                                 |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Auth**               | `LoginForm`, `SignupForm`, `ForgotPasswordForm`, `ResetPasswordForm`, `OTPVerification`, `SocialLoginButtons`, `LogoutConfirmation`, `SessionExpiredModal`                                                                                                             |
| **Commerce**           | `PriceDisplay`, `DiscountBadge`, `QuantityStepper`, `AddToCartButton`, `ProductCard`, `ProductGrid`, `ProductDetails`, `ReviewsList`, `CartItem`, `CartSummary`, `CheckoutForm`, `AddressForm`, `OrderSummary`, `OrderStatus`, `CouponInput`                           |
| **Account & profile**  | `ProfileCard`, `ProfileEditor`, `AvatarUploader`, `AccountSettings`, `PrivacySettings`, `SecuritySettings`, `PasswordChangeForm`, `SubscriptionCard`, `BillingDetails`, `PaymentMethods`, `InvoiceList`, `DeleteAccountFlow`                                           |
| **Social & messaging** | `ChatList`, `ChatBubble`, `MessageComposer`, `VoiceMessage`, `TypingIndicator`, `ReadReceipt`, `NotificationItem`, `CommentBox`, `CommentsList`, `LikeButton`, `ReactionButton`, `FollowButton`, `ReportContentModal`                                                  |
| **Dashboard & admin**  | `AnalyticsCards`, `AuditLog`, `RoleSelector`, `PermissionMatrix`, `SystemStatusPanel`, `Filters`, `SortControl`, `BulkActions`, `UserManagementTable`, `AdminLayout`                                                                                                   |
| **Web**                | `CookieBanner`, `ResponsiveNavbar`, `WebFooter`, `PWAInstallPrompt`                                                                                                                                                                                                    |
| **Full screens**       | `HomeScreen`, `DashboardScreen`, `DetailsScreen`, `SettingsScreen`, `ProfileScreen`, `NotificationsScreen`, `SearchResultsScreen`, `OnboardingScreen`, `WalkthroughScreens`, `HelpScreen`, `NotFoundScreen`, `UnauthorizedScreen`, `NoInternetScreen`, `PricingScreen` |

## More examples

A checkout flow:

```tsx
import { CheckoutForm, OrderSummary } from '@mindees/blocks';

<Stack gap="lg">
  <OrderSummary items={cart} total={cartTotal} currency="USD" />
  <CheckoutForm onSubmit={(values) => placeOrder(values)} loading={submitting} />
</Stack>;
```

A full pricing screen:

```tsx
import { PricingScreen } from '@mindees/blocks';

<PricingScreen plans={plans} onSelectPlan={(name) => subscribe(name)} />;
```

A chat surface:

```tsx
import { ChatList, MessageComposer } from '@mindees/blocks';

<Stack gap="none" height="fill">
  <ChatList conversations={conversations} onPressConversation={(id) => openChat(id)} />
  <MessageComposer onSend={(text) => send(text)} />
</Stack>;
```

## Compatibility

| Runtime          | Versions               | Notes                 |
| ---------------- | ---------------------- | --------------------- |
| **Expo SDK**     | 55, 56                 | both validated in CI  |
| **React Native** | 0.83, 0.85             | New Architecture only |
| **React**        | 19.1+                  |                       |
| **iOS**          | 15.1+                  |                       |
| **Android**      | API 24+                | edge-to-edge default  |
| **Web**          | via `react-native-web` | feasible blocks only  |

Same baseline as [`@mindees/ui`](https://www.npmjs.com/package/@mindees/ui). Full peer-dependency matrix: [`docs/COMPATIBILITY.md`](https://github.com/mindees/mindees-ui/blob/main/docs/COMPATIBILITY.md).

## Documentation

- [Blocks overview](https://mindees-ui.vercel.app/docs/blocks)
- [Getting started](https://mindees-ui.vercel.app/docs)
- [Theming with `createThemes`](https://mindees-ui.vercel.app/docs/theming)
- [Components (@mindees/ui)](https://mindees-ui.vercel.app/docs/components)
- [Contributing](https://github.com/mindees/mindees-ui/blob/main/docs/CONTRIBUTING.md)

## License

[MIT](https://github.com/mindees/mindees-ui/blob/main/LICENSE) © 2026 MindeesUI contributors

---

<details>
<summary><b>Keywords</b> (for npm + Google search)</summary>

react-native-blocks · react-native-templates · react-native-screens · expo-templates · expo-ui-blocks · ui-blocks · screen-templates · react-native-ui-kit · react-native-component-library · login-form · signup-form · auth-screens · checkout-form · cart · product-card · ecommerce-ui · dashboard · admin-panel · pricing-page · onboarding · walkthrough · chat-ui · messaging-ui · comments · settings-screen · profile-screen · empty-state · 404-screen · cookie-banner · pwa-install · responsive-navbar · shadcn-react-native · tamagui-alternative · gluestack-alternative · react-native-design-system · theming · design-tokens · accessibility · wcag · cross-platform · ios · android · react-native-web · typescript · tree-shakeable · expo-router · react-19 · new-architecture · mindees · mindees-ui

</details>
