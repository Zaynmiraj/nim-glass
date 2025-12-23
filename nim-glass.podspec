require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = "nim-glass"
  s.version      = package['version']
  s.summary      = package['description']
  s.homepage     = package['repository']['url']
  s.license      = package['license']
  s.authors      = { "ZaYn Miraj" => "zayn.miraj@gmail.com" }
  
  s.platforms    = { :ios => "12.0" }
  s.source       = { :git => package['repository']['url'], :tag => "v#{s.version}" }
  
  s.source_files = "ios/**/*.{h,m,mm}"
  
  s.dependency "React-Core"
end
