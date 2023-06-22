# userscripts
Scripts for web browsers using tampermonkey or similiar.




**Amazon Notepad** 
was created by LeoDupont https://github.com/LeoDupont/userscripts, all I have done is make a couple of cosmetic tweaks, Leo is awesome for figuring out all of the real code.


 Displays a simple text input under the product's name
  * on product pages (always),
  * on search results pages (if notes were found).

 Notes are saved on 'change' event.
  => the input need to loose focus for the event to be triggered,
  => a simple Tab or a click away will do the job.

 Uses the browser's localStorage to store notes.
  => notes are not synced anywhere on the Internet.

----------

  My Changes:
  
    -> Toggle switch added to hide note section
            Pages with no notes default to hidden
            Pages with notes default to open
            Search results only show the toggle for pages with notes and defaults to open

    -> Changed from single line input to multiline
            Displays all lines instead of using a scroll bar
            Text input area automatically grows in height as you type
                
    -> Color and font changes due to personal preference

