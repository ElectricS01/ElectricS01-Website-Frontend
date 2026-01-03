<template>
  <h2 class="settings-text">Changelog</h2>
  <div>BetterCommunications changelog</div>
  <div class="settings-spacer" />
  <h2 class="settings-text">1.229 TonkGame 0.4.3.1.0</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Update TonkGame to the latest version</li>
    <li>Fixed the link for Non-JavaScript enabled browsers</li>
    <li>Upgrade to Vite 7</li>
  </ul>
  <h2 class="settings-text">1.228 Emoji Quick Picker</h2>
  <div class="settings-spacer" />
  <ul>
    <li v-markdown>
      Added an Emoji Quick Picker to comms activated by typing `:`
    </li>
    <li v-markdown>
      New key combination to quickly change chat with `opt` or `alt` + `up` or
      `down`
    </li>
    <li>Fixed the "Scroll to bottom" button not working</li>
    <li>Changed the rounding of some corners to be more consistent</li>
    <li>Fixed the "Scroll to bottom" button's width</li>
    <li>Changed the background colour of code blocks</li>
    <li>Made mentions more distinct</li>
    <li>
      Added build date in the
      <router-link to="/account/about">About page</router-link>
    </li>
  </ul>
  <h2 class="settings-text">1.227 Image Uploading Alpha</h2>
  <div class="settings-spacer" />
  <ul>
    <li>New Experimental Image Uploading</li>
    <li>Update to work with backend 1.110.0</li>
    <li>Refactoring</li>
  </ul>
  <h2 class="settings-text">1.226 2FA Authentication</h2>
  <div class="settings-spacer" />
  <ul>
    <li>
      Added 2FA Authentication which can be enabled in
      <router-link to="/account/security">Security Settings</router-link>
    </li>
    <li>Update to work with backend 1.109.0</li>
    <li>Upgrade to Vite 6 (1.225.1)</li>
  </ul>
  <h2 class="settings-text">1.225 Extra Game Status information</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Game Status now shows your difficulty and score</li>
    <li>Game Status correctly shows the correct icon for each game</li>
    <li>Update to work with backend 1.108.0</li>
    <li>Update the profile page in settings (1.224.1)</li>
    <li>Fix spacers in settings (1.224.1)</li>
    <li>Bug fixes to Tetris (1.224.1)</li>
  </ul>
  <h2 class="settings-text">1.224 Game Status Update</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Game Status now shows on profile pages</li>
    <li>
      Profiles now show how long you've been playing for and your current score
      in-game
    </li>
    <li>Minor updates to profile pages</li>
    <li>Update to work with backend 1.107.0</li>
    <li>WebSockets for users being added to chats (1.223.2)</li>
    <li>Bug fix to Tetris (1.223.1)</li>
  </ul>
  <h2 class="settings-text">1.223 Tetris Update</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Updated Tetris to 0.28</li>
  </ul>
  <h2 class="settings-text">1.222 Update Notifications in the sidebar</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Update chat notifications in the</li>
    <li>Fix WebSocket failing after logging in or registering</li>
    <li>Refactor chat notifications</li>
    <li>Update to work with backend 1.106.0</li>
    <li>Fix context menus on Chrome 130 and Firefox (1.221.1)</li>
  </ul>
  <h2 class="settings-text">1.221 Login redirects</h2>
  <div class="settings-spacer" />
  <ul>
    <li>
      If a user requests a page but hasn't logged in, they will be sent to that
      page after logging in
    </li>
    <li>
      Fix chat not loading when accessing BetterCommunications through a user's
      link
    </li>
    <li>
      Support multi-line message editing and displaying correctly (1.220.2 and
      1.220.3)
    </li>
    <li>Fix Friends List buttons not refreshing the UI (1.220.1)</li>
  </ul>
  <h2 class="settings-text">1.220 Friends List updates</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Show user's profile pictures on the Friends UI</li>
    <li>Clean up Friends UI</li>
  </ul>
  <h2 class="settings-text">1.219 New Blog Post</h2>
  <div class="settings-spacer" />
  <ul>
    <li>
      Updated the
      <router-link to="/blog">Blog Page</router-link>
      and made it publicly viewable
    </li>
    <li>
      Created the
      <router-link to="/blog/whats-been-happening">Third Blog Post</router-link>
    </li>
  </ul>
  <h2 class="settings-text">1.218 Home Page updates</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Updated the home page</li>
  </ul>
  <h2 class="settings-text">1.217 Planit on the Home Page</h2>
  <div class="settings-spacer" />
  <ul>
    <li>
      Added
      <router-link to="/planit">Planit</router-link>
      to the
      <router-link to="/">Home Page</router-link>
    </li>
  </ul>
  <h2 class="settings-text">1.216 Multi-line inputs</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Added multi-line inputs to user descriptions and messaging</li>
  </ul>
  <h2 class="settings-text">1.215 Tetris Scores</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Improved Tetris Score saving</li>
    <li>Your Ultra Nightmare Score is now Displayed</li>
    <li>Fixed Tetris Scores showing incorrectly on your profile in settings</li>
    <li>Update to work with backend 1.105.0</li>
  </ul>
  <h2 class="settings-text">1.214 Tetris Update</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Updated Tetris to 0.27</li>
  </ul>
  <h2 class="settings-text">1.213 More Game Status</h2>
  <div class="settings-spacer" />
  <ul>
    <li>
      Your status in BetterCommunications will now change when playing all games
      on ElectricS01.com
    </li>
    <li>Update to work with backend 1.104.0</li>
  </ul>
  <h2 class="settings-text">1.212 Game Status</h2>
  <div class="settings-spacer" />
  <ul>
    <li>
      Your status in BetterCommunications will now change when playing Tetris on
      ElectricS01.com
    </li>
    <li>Update to work with backend 1.103.0</li>
  </ul>
  <h2 class="settings-text">1.211 Home Page updates and big fixes</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Added TPU and TPU Mac to the Home Page</li>
    <li>Fixed error messages with BetterCommunications</li>
  </ul>
  <h2 class="settings-text">1.210 UI Updates</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Added BetterCommunications to the Home Page</li>
    <li>Update to animations on all pages</li>
  </ul>
  <h2 class="settings-text">1.209 UI Updates</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Updates to New UI</li>
    <li>Update to Tetris score syncing</li>
  </ul>
  <h2 class="settings-text">1.208 Friends List</h2>
  <div class="settings-spacer" />
  <ul>
    <li>
      Added a friends list which shows all incoming, outgoing, and accepted
      friends
    </li>
    <li>Update to work with backend 1.102.0</li>
  </ul>
  <h2 class="settings-text">1.207 Backend Server Name</h2>
  <div class="settings-spacer" />
  <ul>
    <li>
      Display Backend Server Name in the
      <router-link to="/account/about">About Page</router-link>
    </li>
    <li>Add browser titles to all pages</li>
    <li>Refactor file paths</li>
  </ul>
  <h2 class="settings-text">1.206 Bug fixes</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Add padding and change colour of mentions</li>
    <li>Add tooltips to navbar items</li>
    <li>Hide user status when they're offline</li>
    <li>Add "Copy User ID" to user context menu</li>
  </ul>
  <h2 class="settings-text">1.205 Bug fixes</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Update context menus to work on Chromium 124+</li>
    <li>Fix message contents not updating when edited</li>
    <li>Update to work with backend 1.101.0</li>
    <li>
      Fix WebSocket adding new messages in the wrong chats (1.204.4 and 1.204.5)
    </li>
    <li>Fix pinned messages sidebar breaking "Scroll to bottom" (1.204.4)</li>
    <li>Fix new background image (1.204.1, 1.204.2, and 1.204.3)</li>
    <li>Updated dependencies (1.204.2)</li>
  </ul>
  <h2 class="settings-text">1.204 New UI</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Updated the UI of the Home Page to match the rest of my websites</li>
  </ul>
  <h2 class="settings-text">1.203 TonkGame 0.4.3.0.0</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Update TonkGame to the latest version</li>
  </ul>
  <h2 class="settings-text">1.202 Users list WebSockets</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Added WebSockets to the users list</li>
    <li>Fixed bug with duplicated users in the users list</li>
    <li>Updated dependencies</li>
  </ul>
  <h2 class="settings-text">1.201 New Blog Updates</h2>
  <div class="settings-spacer" />
  <ul>
    <li>
      Updated the
      <router-link to="/blog">Blog Page</router-link>
      and added it to the navbar
    </li>
    <li>
      Created the
      <router-link to="/blog/learning-rust">Second Blog Post</router-link>
    </li>
    <li>
      Added
      <router-link to="/scheduler">BetterScheduler</router-link>
      to the
      <router-link to="/">Home Page</router-link>
    </li>
    <li>Upgrade to Vite PWA to 0.18.0</li>
    <li>Updated dependencies</li>
  </ul>
  <h2 class="settings-text">1.200 Blog</h2>
  <div class="settings-spacer" />
  <ul>
    <li>
      Created
      <router-link to="/blog">Blog</router-link>
    </li>
    <li>
      Created
      <router-link to="/blog/first-post">First Blog Post</router-link>
    </li>
    <li>Refactoring</li>
    <li>Update PWA manifest</li>
    <li>Include more assets with PWA</li>
    <li>Updated dependencies</li>
    <li>Bug fixes (1.199.1 and 1.199.2)</li>
    <li>Updated dependencies (1.199.2)</li>
  </ul>
  <h2 class="settings-text">1.199 New Messages</h2>
  <div class="settings-spacer" />
  <ul>
    <li>
      You can now see the number of new messages in a chat in the Chats List
    </li>
    <li>
      Added descriptions to Allow Encrypted direct messages and Save your
      Encryption Private Key in
      <router-link to="/account/security">Security Settings</router-link>
      (1.198.1)
    </li>
    <li>Update to work with backend 1.99.0</li>
    <li>Bug fixes (1.198.1)</li>
    <li>Updated dependencies (1.198.1)</li>
  </ul>
  <h2 class="settings-text">1.198 Encryption</h2>
  <div class="settings-spacer" />
  <ul>
    <li>
      When you create an account, a public-private keypair will be generated and
      saved to your account
    </li>
    <li>Your private key will be encrypted by your password</li>
    <li>
      Added Allow Encrypted direct messages in
      <router-link to="/account/security">Security Settings</router-link>
    </li>
    <li>
      Added Save your Encryption Private Key in
      <router-link to="/account/security">Security Settings</router-link>
    </li>
    <li>Update to work with backend 1.98.0</li>
    <li>Bug fixes</li>
    <li>Updated dependencies</li>
  </ul>
  <h2 class="settings-text">1.197 Pinned Messages</h2>
  <div class="settings-spacer" />
  <ul>
    <li>You can now pin your own messages</li>
    <li>Icon updates</li>
    <li>Update to use bun</li>
    <li>Update to work with backend 1.97.0</li>
    <li>Bug fixes (1.196.1)</li>
    <li>Bug fixes</li>
    <li>Updated dependencies</li>
    <li>Refactoring</li>
  </ul>
  <h2 class="settings-text">1.196 Admin updates</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Updated admin analytics</li>
    <li>Context menus now close when you click off them</li>
    <li>Update to work with backend 1.94.0</li>
    <li>Fix ESLint (1.195.1)</li>
    <li>Bug fixes (1.195.1)</li>
    <li>Bug fixes</li>
    <li>Refactoring (1.195.1)</li>
  </ul>
  <h2 class="settings-text">1.195 Add users to chats</h2>
  <div class="settings-spacer" />
  <ul>
    <li>You can now add users to a chat using their username</li>
    <li>Update to work with backend 1.93.0</li>
    <li>Fix invalid mentions causing errors</li>
    <li>Other bug fixes</li>
    <li>Refactoring</li>
    <li>Updated dependencies</li>
  </ul>
  <h2 class="settings-text">1.194 Create DMs with anyone</h2>
  <div class="settings-spacer" />
  <ul>
    <li>
      You can now create a Direct Message with anyone using the "Create Chat"
      menu
    </li>
    <li>Update to work with backend 1.92.0</li>
    <li>Fix Chat Creation (1.193.2 and 1.193.3)</li>
    <li>Bug fixes (1.193.1)</li>
    <li>Bug fixes</li>
    <li>Updated dependencies</li>
  </ul>
  <h2 class="settings-text">1.193 Offline users</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Users are now sent offline when they close BetterCommunications</li>
    <li>Offline users now become online when they open BetterCommunications</li>
    <li>Online and offline users now update on the users sidebar</li>
    <li>BetterCommunications should load faster now</li>
    <li>Update to work with backend 1.90.0</li>
    <li>Refactoring</li>
    <li>Updated dependencies</li>
  </ul>
  <h2 class="settings-text">1.192 WebSockets</h2>
  <div class="settings-spacer" />
  <ul>
    <li>
      Added WebSockets so you don't need to refresh the page to see new messages
    </li>
    <li>Update ESLint to be more strict</li>
    <li>Fix ESLint (1.191.1)</li>
    <li>Update to work with backend 1.89.0</li>
    <li>Bug fixes</li>
    <li>Refactoring</li>
    <li>Updated dependencies</li>
  </ul>
  <h2 class="settings-text">1.191 Logout everywhere</h2>
  <div class="settings-spacer" />
  <ul>
    <li>
      Added
      <router-link to="/scheduler">/scheduler link</router-link>
    </li>
    <li>
      Added Sign out everywhere in
      <router-link to="/account/security">Security Settings</router-link>
    </li>
    <li>Logging out will now delete your session</li>
    <li>Sessions updates</li>
    <li>Upgrade to Vite 5</li>
    <li>UI cleanup</li>
    <li>Bug fixes</li>
    <li>Updated dependencies</li>
  </ul>
  <h2 class="settings-text">1.190 Sessions</h2>
  <div class="settings-spacer" />
  <ul>
    <li>
      Quick Switcher now works offline or without being logged in (1.189.2 and
      1.189.2)
    </li>
    <li>
      Added Sessions in
      <router-link to="/account/account">Security Settings</router-link>
    </li>
    <li>
      The date and time when a message was edited can now be seen by hovering
      over the "(edited)" text next to the message
    </li>
    <li>Fixed context menus going off the screen</li>
    <li>Bug fixes</li>
    <li>Refactoring</li>
  </ul>
  <h2 class="settings-text">1.189 Logout button</h2>
  <div class="settings-spacer" />
  <ul>
    <li>
      Added a logout button in
      <router-link to="/account/account">Account Settings</router-link>
    </li>
    <li>
      Added
      <router-link to="/account/account">Security Settings</router-link>
    </li>
    <li>Bug fixes</li>
    <li>Updated dependencies</li>
  </ul>
  <h2 class="settings-text">1.188 Quick Switcher updates</h2>
  <div class="settings-spacer" />
  <ul>
    <li>You can now press on Quick Switcher items</li>
    <li>Updates to "New Messages" status indicator</li>
    <li>Bug fixes</li>
  </ul>
  <h2 class="settings-text">1.187 Quick Switcher communications updates</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Your chats are now shown in the Quick Switcher</li>
    <li>Bug fixes</li>
    <li>Updated dependencies</li>
  </ul>
  <h2 class="settings-text">1.186 Quick Switcher History</h2>
  <div class="settings-spacer" />
  <ul>
    <li>
      Your most switched pages will be sorted to the top of the quick switcher
    </li>
    <li>Bug fixes</li>
    <li v-markdown>Finish switch to `script setup`</li>
  </ul>
  <h2 class="settings-text">1.185 Quick Switcher updates</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Quick Switcher history will now be saved</li>
    <li>Experimental fix for context menus</li>
    <li>Fixes to the "New Messages" status indicator</li>
    <li>Fix to CSS on homepage</li>
    <li v-markdown>Switched more code to `script setup`</li>
  </ul>
  <h2 class="settings-text">1.184 Quick Switcher Added</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Added Quick Switcher</li>
    <li>
      Added an option to not save Quick Switcher history online in
      <router-link to="/account/privacy">Privacy Settings</router-link>
    </li>
    <li>Added a button to clear your Quick Switcher history</li>
    <li>
      Added
      <router-link to="/mapit">/mapit link</router-link>
    </li>
    <li v-markdown>Switched more code to `script setup`</li>
    <li v-markdown>Remove `VueAxios` as a dependency</li>
    <li>Refactoring</li>
    <li>Updated dependencies</li>
  </ul>
  <h2 class="settings-text">1.183 Changelog Added</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Added changelog</li>
    <li>Added "New Messages" status indicator</li>
    <li>Fixed issue with search</li>
    <li>Fixed issue with changing status message</li>
    <li>Support for TypeScript backend 1.83.0</li>
    <li v-markdown>Switched more code to `script setup`</li>
    <li>Refactoring</li>
    <li>Updated dependencies</li>
  </ul>
  <h2 class="settings-text">1.182 Tetris Update</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Updated Tetris to 0.25</li>
  </ul>
  <h2 class="settings-text">1.181 Tetris Update</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Updated Tetris to 0.24</li>
    <li>Bug fixes</li>
    <li v-markdown>Switched more code to `script setup`</li>
    <li>Refactoring</li>
  </ul>
  <h2 class="settings-text">1.180 PWA updates</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Set a theme colour for PWAs</li>
    <li>Update PWA manifest</li>
    <li v-markdown>Switched more code to `script setup`</li>
    <li>Refactoring</li>
  </ul>
  <h2 class="settings-text">1.179 Refactoring and Bug fixes</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Bug fixes</li>
    <li v-markdown>Switched more code to `script setup`</li>
    <li>Refactoring</li>
  </ul>
  <h2 class="settings-text">1.178 Embed Previews</h2>
  <div class="settings-spacer" />
  <ul>
    <li>You can now click on an Embed to show a larger preview</li>
    <li>Bug fixes</li>
    <li v-markdown>Switched more code to `script setup`</li>
    <li>Refactoring</li>
  </ul>
  <h2 class="settings-text">1.177 Refactoring</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Bug fixes</li>
    <li v-markdown>Switched some code to `script setup`</li>
    <li>Refactoring</li>
    <li>Updated dependencies</li>
  </ul>
  <h2 class="settings-text">1.176 Add users to chats</h2>
  <div class="settings-spacer" />
  <ul>
    <li>You can now add users to chats</li>
    <li>Bug fixes</li>
    <li>Refactoring</li>
    <li>Update to work with backend 1.81.0</li>
  </ul>
  <h2 class="settings-text">1.175 Collider Update</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Update Collider to latest version</li>
  </ul>
  <h2 class="settings-text">1.174 User Profile Links</h2>
  <div class="settings-spacer" />
  <ul>
    <li v-markdown>
      Users can now share their User Profile with the new `/user/:id` route
    </li>
  </ul>
  <h2 class="settings-text">1.173 Removing users from chats</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Owners may now remove users from their chats</li>
    <li>Sort chat's users when the chat loads</li>
    <li>Refactor messages</li>
  </ul>
  <h2 class="settings-text">1.172 Bug fix for Collider</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Collider will now resize to fit in your browser window</li>
  </ul>
  <h2 class="settings-text">1.171 Bug fix for Tetris</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Tetris will now correctly resize to fit in your browser window</li>
  </ul>
  <h2 class="settings-text">1.170 Add my new game, Collider</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Added Collider</li>
    <li>
      Added
      <router-link to="/collider">/collider link</router-link>
    </li>
  </ul>
  <h2 class="settings-text">1.169 Tetris</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Tetris will now resize to fit in your browser window</li>
  </ul>
  <h2 class="settings-text">1.168 Users list Context Menu</h2>
  <div class="settings-spacer" />
  <ul>
    <li>
      Added a context menu when you right-click on a user in the users list
    </li>
    <li>Mentions now show the user's username</li>
    <li>Refactor the users list</li>
  </ul>
  <h2 class="settings-text">1.167 UX updates</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Changed the rounding of some corners to be more consistent</li>
    <li>Fix creating chats</li>
  </ul>
  <h2 class="settings-text">1.166 Fixed clickable mentions</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Clicking a mention now properly shows the user's profile page</li>
    <li>Improve error messages</li>
    <li>Refactoring</li>
  </ul>
  <h2 class="settings-text">1.165 Clickable mentions</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Clicking a mention now shows the user's profile page</li>
    <li>Refactoring</li>
  </ul>
  <h2 class="settings-text">1.164 Non-JavaScript browser link</h2>
  <div class="settings-spacer" />
  <ul>
    <li>Added a link to access the website without JavaScript enabled</li>
  </ul>
</template>
