Set objShell = CreateObject("Wscript.Shell")
strPath = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
objShell.Run "cmd /c cd /d """ & strPath & """ && start msedge http://localhost:5173 && npx vite --host", 0, False
