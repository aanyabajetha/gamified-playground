import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Pencil, GitMerge, Trash2, Wand2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

/**
 * TransformControls component for selecting and configuring code transformations
 *
 * @param {Object} props - Component props
 * @param {Array} props.availableTransformers - List of available transformers
 * @param {Function} props.onTransformSelect - Callback when a transformer is selected
 * @param {Function} props.onApplyTransform - Callback when transform is applied
 * @param {Function} props.onRenameVariables - Callback for renaming variables
 * @param {Function} props.onFlattenControlFlow - Callback for flattening control flow
 * @param {Function} props.onRemoveDeadCode - Callback for removing dead code
 * @param {Function} props.onAutoDeobfuscate - Callback for auto deobfuscation
 * @returns {JSX.Element} TransformControls component
 */
function TransformControls({
  availableTransformers = [],
  onTransformSelect,
  onApplyTransform,
  onRenameVariables,
  onFlattenControlFlow,
  onRemoveDeadCode,
  onAutoDeobfuscate
}) {
  const [selectedTransformer, setSelectedTransformer] = useState('');
  const [transformOptions, setTransformOptions] = useState({});
  const [activeTab, setActiveTab] = useState('quick');

  const handleTransformerChange = (e) => {
    const transformerId = e.target.value;
    setSelectedTransformer(transformerId);

    // Reset options when changing transformer
    setTransformOptions({});

    if (onTransformSelect) {
      onTransformSelect(transformerId);
    }
  };

  const handleOptionChange = (optionName, value) => {
    setTransformOptions(prev => ({
      ...prev,
      [optionName]: value
    }));
  };

  const handleApply = () => {
    if (onApplyTransform && selectedTransformer) {
      onApplyTransform(selectedTransformer, transformOptions);
    }
  };

  // Find the selected transformer object
  const selectedTransformerObj = availableTransformers.find(t => t.id === selectedTransformer);

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-xl text-white">
      <CardHeader>
        <CardTitle className="text-center text-xl">Transform Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="quick" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full bg-[#001428]/80">
            <TabsTrigger value="quick" className="text-white data-[state=active]:bg-blue-600">
              Quick Actions
            </TabsTrigger>
            <TabsTrigger value="custom" className="text-white data-[state=active]:bg-cyan-600">
              Custom Transform
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quick" className="mt-4">
            <div className="grid grid-cols-2 gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-blue-600/20 hover:bg-blue-600/40 border-blue-500/50 text-white flex items-center justify-center gap-2 h-16"
                      onClick={onRenameVariables}
                      disabled={!onRenameVariables}
                    >
                      <Pencil className="h-5 w-5" />
                      <span>Rename Variables</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-blue-800 text-white">
                    <p>Rename obfuscated variables to more readable names</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-cyan-600/20 hover:bg-cyan-600/40 border-cyan-500/50 text-white flex items-center justify-center gap-2 h-16"
                      onClick={onFlattenControlFlow}
                      disabled={!onFlattenControlFlow}
                    >
                      <GitMerge className="h-5 w-5" />
                      <span>Flatten Control Flow</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-cyan-800 text-white">
                    <p>Simplify nested control flow structures</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-blue-600/20 hover:bg-blue-600/40 border-blue-500/50 text-white flex items-center justify-center gap-2 h-16"
                      onClick={onRemoveDeadCode}
                      disabled={!onRemoveDeadCode}
                    >
                      <Trash2 className="h-5 w-5" />
                      <span>Remove Dead Code</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-blue-800 text-white">
                    <p>Remove unreachable or unused code</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-cyan-600/20 hover:bg-cyan-600/40 border-cyan-500/50 text-white flex items-center justify-center gap-2 h-16"
                      onClick={onAutoDeobfuscate}
                      disabled={!onAutoDeobfuscate}
                    >
                      <Wand2 className="h-5 w-5" />
                      <span>Auto Deobfuscate</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-cyan-800 text-white">
                    <p>Automatically apply multiple deobfuscation techniques</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </TabsContent>

          <TabsContent value="custom" className="mt-4 space-y-4">
            <div className="mb-4">
              <label
                htmlFor="transformer-select"
                className="block text-sm font-medium text-white/90 mb-2"
              >
                Select Transformation:
              </label>
              <select
                id="transformer-select"
                value={selectedTransformer}
                onChange={handleTransformerChange}
                className="w-full px-3 py-2 bg-[#001428] border border-blue-500/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              >
                <option value="">-- Select a transformer --</option>
                {availableTransformers.map(transformer => (
                  <option key={transformer.id} value={transformer.id}>
                    {transformer.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedTransformerObj && (
              <>
                <div className="mb-2 text-sm text-white/80 bg-[#001428]/80 p-3 rounded-md border border-blue-500/30">
                  {selectedTransformerObj.description}
                </div>

                {Object.keys(selectedTransformerObj.options || {}).length > 0 && (
                  <div className="transform-options mb-4 p-3 bg-[#001428]/80 rounded-md border border-blue-500/30">
                    <h4 className="text-sm font-medium text-white/90 mb-2">Options</h4>
                    <div className="space-y-3">
                      {Object.entries(selectedTransformerObj.options).map(([key, option]) => (
                        <div key={key} className="flex items-center">
                          {option.type === 'boolean' ? (
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={transformOptions[key] ?? option.default}
                                onChange={(e) => handleOptionChange(key, e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 bg-[#001428] border-blue-500/50 rounded"
                              />
                              <span className="ml-2 text-sm text-white/90">{option.label}</span>
                            </label>
                          ) : (
                            <div className="w-full">
                              <label className="block text-sm text-white/90">{option.label}</label>
                              <input
                                type="text"
                                value={transformOptions[key] ?? option.default}
                                onChange={(e) => handleOptionChange(key, e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-[#001428] border border-blue-500/50 rounded-md text-sm text-white"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <Button
              variant="glow"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500"
              onClick={handleApply}
              disabled={!selectedTransformer}
            >
              Apply Custom Transformation
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default TransformControls;
